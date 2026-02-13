// 引入 passport-jwt 包中的 JWT 验证策略构造函数
// JwtStrategy 是一套现成的 JWT 验证规则模板
let JwtStrategy = require('passport-jwt').Strategy;

// 引入 passport-jwt 包中的 Token 提取工具
// ExtractJwt 负责从请求中把 Token 找出来
let ExtractJwt = require('passport-jwt').ExtractJwt;

// 引入用户数据库模型，用于根据 JWT 中的用户 id 查询数据库
const User = require('../models').User;


// 导出一个函数，调用时需要传入 passport 对象
// 在 app.js 中通过 require('./config/passport')(passport) 调用
module.exports = (passport) => {

  // 创建一个空的配置对象，后续往里面添加配置项
  let opts = {};

  // 配置：去哪里提取 Token
  // fromAuthHeaderWithScheme("jwt") 表示从请求头的 Authorization 字段提取
  // 前端发请求时请求头格式必须是：Authorization: jwt <token>
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

  // 配置：验证 Token 签名用的密钥
  // 从环境变量读取，避免密钥硬编码在代码里导致泄露
  // 这个密钥和当初签发 Token 时用的密钥必须是同一个
  opts.secretOrKey = process.env.PASSPORT_SECRET;


  // 向 passport 注册 JWT 验证策略
  // 以后在路由中使用 passport.authenticate('jwt') 时就会执行这套规则
  passport.use(

    // 用配置项和回调函数创建一个 JWT 策略实例
    // opts       —— 上面配置的选项（从哪提取Token、用什么密钥）
    // 回调函数   —— Token 验证通过后自动调用，接收解码数据和完成函数
    new JwtStrategy(opts, async function (jwt_payload, done) {
      // jwt_payload 是 Token 解密后的数据，例如：
      // { _id: "6507f1f81c9d440000d1b2a3", email: "user@example.com" }

      // done 是汇报验证结果的函数，调用方式：
      // done(null, 用户对象)  —— 验证成功，用户对象会挂载到 req.user
      // done(null, false)     —— 验证失败，返回 401
      // done(错误对象, false) —— 服务器出错，返回 500

      try {
        // 用 jwt_payload 中的 _id 去数据库查询该用户是否真实存在
        // 仅凭 Token 合法还不够，还需确认用户在数据库中依然存在
        // 防止已被删除或封禁的用户凭旧 Token 继续访问
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();

        if (foundUser) {
          // 用户存在 —— 验证成功
          // foundUser 会被 passport 挂载到 req.user 上
          // 后续路由中可以通过 req.user 获取当前登录用户的信息
          return done(null, foundUser);
        } else {
          // 用户不存在（可能已被删除，或 Token 中的 id 无效）
          // 返回 false 表示验证失败，passport 会响应 401 未授权
          return done(null, false);
        }

      } catch (e) {
        // 数据库查询过程中发生异常（如数据库连接断开等）
        // 将错误传给 done，passport 会响应 500 服务器错误
        return done(e, false);
      }
    })
  );
};