# 用户 Token 认证逻辑讲解

## 一、为什么要用 Token？

- 登录成功后，**服务端不保存 session**（无状态），而是给前端一个 **JWT（JSON Web Token）**。
- 之后前端每次请求受保护接口时，在请求头里带上这个 token。
- 后端用**同一把密钥**验签 token，解出里面的用户信息（如 `_id`），再查库得到完整用户，挂到 `req.user`，这样路由就知道「当前是谁在访问」。

---

## 二、Token 是什么长什么样？

JWT 是一段字符串，由三部分组成（用 `.` 隔开）：

```
Header.Payload.Signature
```

- **Payload** 里存的是**你塞进去的数据**，例如：`{ _id: "用户id", email: "xxx@xx.com" }`（以及过期时间等）。
- **Signature** 是用密钥对「Header + Payload」做签名得到的，用来防篡改。
- 后端用**同一把密钥**验证签名，通过就认为 token 可信，再根据 payload 里的 `_id` 去数据库查用户。

---

## 三、整体流程（5 步）

```
登录成功 → 后端签发 token 并返回
    ↓
前端把 token 存进 localStorage，之后每次请求课程接口时从 localStorage 取出 token
    ↓
请求头里带上：Authorization: <token>
    ↓
请求先经过 passport.authenticate('jwt')：从请求头取 token → 验签 → 用 _id 查用户 → req.user = 用户
    ↓
进入课程路由，用 req.user 做权限判断（是否讲师、是否本人等）
```

下面按「签发 → 存储与携带 → 验证 → 使用」对应到你项目里的代码。

---

## 四、第 1 步：登录时后端签发 Token

**位置**：`server/routes/auth.js` 的 `POST /login`。

逻辑要点：

1. 校验邮箱、密码格式（Joi）。
2. 用邮箱查用户：`User.findOne({ email: req.body.email })`。
3. 用 `foundUser.comparePassword(req.body.password)` 比对密码（bcrypt）。
4. **密码正确时**，构造 payload 并签发 token：

```javascript
const tokenObject = { _id: foundUser._id, email: foundUser.email };
const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: '7d' });
return res.send({
    msg: "登录成功",
    token: "JWT " + token,   // 注意：返回时带了 "JWT " 前缀
    user: foundUser,
});
```

- **Payload**：只放 `_id` 和 `email`，用于后续验签后识别用户。
- **密钥**：`process.env.PASSPORT_SECRET`，必须和后面验签用同一把。
- **过期时间**：`expiresIn: '7d'`，7 天后 token 会失效。
- **返回给前端的 token**：是字符串 `"JWT " + token`，前端**原样保存、原样放在请求头里**即可。

---

## 五、第 2 步：前端存 Token 并带在请求里

### 5.1 登录成功后存储

**位置**：`client/src/components/login-component.js`。

登录请求成功后，把后端返回的整包（含 `token`、`user`）存进 localStorage：

```javascript
let response = await AuthService.login(email, password);
localStorage.setItem("user", JSON.stringify(response.data));
// response.data = { msg, token: "JWT xxx...", user: {...} }
```

所以本地存的 `user` 对象里有一个字段 `token`，值就是 `"JWT " + token` 这一整串。

### 5.2 访问课程接口时带上 Token

**位置**：`client/src/services/course.service.js`。

每次请求课程接口前，从 localStorage 取出 `user`，再取出 `token`，放进请求头 **Authorization**：

```javascript
let token = JSON.parse(localStorage.getItem("user")).token;  // "JWT xxx..."
return axios.post(API_URL, { title, description, price }, {
  headers: {
    Authorization: token,   // 请求头：Authorization: JWT eyJhbGci...
  },
});
```

也就是说：**前端发到后端的格式是 `Authorization: JWT <token>`**，和下面后端「从哪里取、按什么格式解析」要一致。

---

## 六、第 3 步：后端从哪里取 Token、怎么验签

**位置**：`server/config/passport.js`。

这里用 **passport-jwt** 的 `JwtStrategy`，做两件事：  
1）从请求里把 token 取出来；  
2）用密钥验签，并调用你写的回调，把用户挂到 `req.user`。

### 6.1 从哪里取 Token

```javascript
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
```

- 表示：从请求头 **Authorization** 里取，且要求格式是 **`jwt <token>`**（scheme 为小写 `jwt`，后面一个空格再跟 token 字符串）。
- 你登录返回的是 `"JWT " + token`，前端把整串放进 `Authorization`，即 `Authorization: JWT eyJhbGci...`。  
  passport-jwt 的 `fromAuthHeaderWithScheme("jwt")` 会按 scheme 匹配，**一般会忽略大小写**，所以 `JWT` 和 `jwt` 通常都能通过。若你遇到 401，可检查前端传的到底是 `JWT ` 还是 `jwt `，和后端配置一致即可。

### 6.2 用什么密钥验签

```javascript
opts.secretOrKey = process.env.PASSPORT_SECRET;
```

- 必须和登录签发时用的 `process.env.PASSPORT_SECRET` 一致，否则验签失败，直接 401。

### 6.3 验签通过后做什么（查用户 → req.user）

策略回调里会收到**已验签、解码后的 payload**（即当时的 `{ _id, email }`）：

```javascript
new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
    if (foundUser) {
      return done(null, foundUser);   // 成功：req.user = foundUser
    } else {
      return done(null, false);       // 用户不存在：401
    }
  } catch (e) {
    return done(e, false);            // 出错：500
  }
});
```

- **验签通过**后才会执行这个回调；若 token 无效或过期，passport 不会调这里，直接返回 401。
- 用 **payload 里的 `_id`** 再查一次 User，保证「token 里的用户当前仍存在」（防止用户已删或封禁还拿着旧 token 访问）。
- `done(null, foundUser)` 表示认证成功，Passport 会把 **foundUser** 挂到 **req.user**，后续中间件和路由都能用到。

---

## 七、第 4 步：哪些请求会走 Token 认证？

**位置**：`server/index.js`。

```javascript
app.use("/api/courses", passport.authenticate('jwt', { session: false }), courseRoute);
```

- 所有以 **`/api/courses`** 开头的请求，都会**先**经过 `passport.authenticate('jwt', { session: false })`。
- **session: false**：表示不启用 session，完全靠 JWT 判断身份。
- 行为是：
  - 从请求头按 scheme `jwt` 取 token → 用 `PASSPORT_SECRET` 验签 → 执行上面 JwtStrategy 里的回调 → 成功则 `req.user = foundUser`，然后进入 `courseRoute`；
  - 任一环节失败（没 token、token 无效、过期、用户不存在等）：**不会进入 courseRoute**，直接返回 401。

而 **`/api/user`**（登录、注册）没有挂 `passport.authenticate('jwt')`，所以**不需要**带 token，用来拿 token 的登录接口本身就不受 JWT 保护。

---

## 八、第 5 步：课程路由里怎么用 req.user？

**位置**：`server/routes/course-route.js`。

因为所有 `/api/courses` 的请求都已经过了 `passport.authenticate('jwt')`，所以进到 course 路由时 **req.user 一定存在**（否则早就 401 了）。路由里用 `req.user` 做两件事：

1. **身份判断**：是学生还是讲师（例如发课只允许讲师）。
2. **归属判断**：这门课是不是当前用户创建的（改/删只允许该课讲师）。

示例：

- **发课** `POST /`：  
  - 先判断 `req.user.isStudent()`，若是学生直接 400「只有讲师才能发课」。  
  - 创建课程时把 `instructor` 设为 `req.user._id`。
- **选课** `POST /enroll/:_id`：  
  - 把 `req.user._id` push 进 `course.students`，表示当前用户选了这门课。
- **改课** `PATCH /:_id`、**删课** `DELETE /:_id`：  
  - 先查课程，再判断 `courseFound.instructor.equals(req.user._id)`，只有讲师本人才能改/删。

所以：**Token 认证负责「是谁」；课程路由里的 if 负责「能不能做这件事」。**

---

## 九、小结（对应关系）

| 环节         | 位置                     | 做什么 |
|--------------|--------------------------|--------|
| 签发 token   | auth.js 的 POST /login   | 密码正确 → jwt.sign({ _id, email }, PASSPORT_SECRET, { expiresIn: '7d' }) → 返回 "JWT " + token |
| 存 token     | 前端 login 组件          | 把接口返回的 { token, user } 存进 localStorage |
| 带 token     | 前端 course.service      | 请求课程接口时 headers: { Authorization: localStorage 里的 token } |
| 取 token     | config/passport.js       | ExtractJwt.fromAuthHeaderWithScheme("jwt")，从 Authorization 里按 scheme 取 |
| 验签 + 查用户| config/passport.js       | secretOrKey = PASSPORT_SECRET；回调里用 jwt_payload._id 查 User，done(null, foundUser) |
| 保护路由     | index.js                 | app.use("/api/courses", passport.authenticate('jwt', { session: false }), courseRoute) |
| 使用身份     | course-route.js          | 用 req.user 做 isStudent/isInstructor 和 instructor 归属判断 |

整条链就是：**登录拿到 JWT → 前端存并每次带在 Authorization → 后端用同一密钥验签并从 token 里拿 _id 查用户 → 把用户挂到 req.user → 课程路由用 req.user 做权限控制。** 这就是你项目里的「用户 token 认证」逻辑。
