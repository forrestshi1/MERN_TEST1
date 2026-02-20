# React 中修改 CSS 和 JS 的完整指南

## 📝 目录
1. [CSS 修改方式](#css-修改方式)
2. [JS 逻辑修改方式](#js-逻辑修改方式)
3. [实际项目示例](#实际项目示例)

---

## 🎨 CSS 修改方式

### 方式 1：内联样式（Inline Styles）

**语法**：`style={{ 属性名: "值" }}`

```jsx
<div style={{ 
  backgroundColor: "blue",
  color: "white",
  padding: "20px"
}}>
  内容
</div>
```

**特点**：
- ✅ 简单直接，样式和组件在一起
- ❌ 不能写伪类（:hover）、媒体查询
- ❌ 不能复用样式

**适用场景**：简单的、一次性的样式

---

### 方式 2：导入 CSS 文件（推荐）

**步骤**：

1. **创建 CSS 文件**（例如：`HomeComponent.css`）
```css
/* HomeComponent.css */
.my-class {
  background-color: blue;
  color: white;
  padding: 20px;
}

.my-class:hover {
  background-color: darkblue;
}
```

2. **在组件中导入**
```jsx
import React from "react";
import "./HomeComponent.css";  // 导入 CSS 文件

const MyComponent = () => {
  return (
    <div className="my-class">  {/* 使用类名 */}
      内容
    </div>
  );
};
```

**特点**：
- ✅ 可以写所有 CSS 特性（伪类、媒体查询、动画等）
- ✅ 样式可以复用
- ✅ 代码分离，易维护

**注意**：导入的 CSS 是**全局生效**的，所有组件都能用这些类名

---

### 方式 3：CSS Modules（推荐用于大型项目）

**步骤**：

1. **创建 CSS Module 文件**（文件名必须是 `*.module.css`）
```css
/* HomeComponent.module.css */
.container {
  background-color: blue;
}

.title {
  font-size: 2rem;
}
```

2. **在组件中导入**
```jsx
import React from "react";
import styles from "./HomeComponent.module.css";  // 导入为对象

const MyComponent = () => {
  return (
    <div className={styles.container}>  {/* 使用 styles.类名 */}
      <h1 className={styles.title}>标题</h1>
    </div>
  );
};
```

**特点**：
- ✅ 样式**局部作用域**，不会污染全局
- ✅ 类名会被自动转换（避免冲突）
- ✅ 适合大型项目

---

### 方式 4：使用 CSS-in-JS 库（如 styled-components）

**安装**：
```bash
npm install styled-components
```

**使用**：
```jsx
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 20px;
  
  &:hover {
    background-color: darkblue;
  }
`;

const MyComponent = () => {
  return <StyledButton>点击我</StyledButton>;
};
```

---

## ⚙️ JS 逻辑修改方式

### 1. 状态管理（useState）

**用途**：存储组件内部会变化的数据

```jsx
import React, { useState } from "react";

const MyComponent = () => {
  // 定义状态：const [变量名, 更新函数] = useState(初始值)
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
      
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      
      {isVisible && <div>可见内容</div>}
    </div>
  );
};
```

---

### 2. 副作用处理（useEffect）

**用途**：处理组件挂载、更新、卸载时的逻辑

```jsx
import React, { useState, useEffect } from "react";

const MyComponent = () => {
  const [data, setData] = useState(null);

  // 组件挂载时执行（类似 componentDidMount）
  useEffect(() => {
    console.log("组件已加载");
    // 可以在这里：调用 API、订阅事件、设置定时器等
  }, []); // 空数组 = 只执行一次

  // 依赖项变化时执行
  useEffect(() => {
    console.log("data 变化了:", data);
  }, [data]); // 当 data 变化时执行

  // 清理函数（组件卸载时执行）
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("定时器执行");
    }, 1000);

    return () => {
      clearInterval(timer); // 组件卸载时清理
    };
  }, []);

  return <div>内容</div>;
};
```

---

### 3. 事件处理函数

**用途**：响应用户交互（点击、输入、提交等）

```jsx
const MyComponent = () => {
  // 方式1：直接在 JSX 中写箭头函数
  const handleClick1 = () => {
    console.log("点击了");
  };

  // 方式2：定义普通函数
  function handleClick2() {
    console.log("点击了");
  }

  // 方式3：带参数的事件处理
  const handleSubmit = (event) => {
    event.preventDefault(); // 阻止默认行为
    console.log("表单提交");
  };

  return (
    <div>
      <button onClick={handleClick1}>按钮1</button>
      <button onClick={handleClick2}>按钮2</button>
      
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">提交</button>
      </form>
    </div>
  );
};
```

---

### 4. 条件渲染

**用途**：根据条件显示/隐藏内容

```jsx
const MyComponent = ({ user }) => {
  // 方式1：三元运算符
  return (
    <div>
      {user ? (
        <div>欢迎, {user.name}</div>
      ) : (
        <div>请登录</div>
      )}
    </div>
  );

  // 方式2：逻辑与运算符（&&）
  return (
    <div>
      {user && <div>欢迎, {user.name}</div>}
      {!user && <div>请登录</div>}
    </div>
  );

  // 方式3：if-else（在函数体内）
  if (!user) {
    return <div>请登录</div>;
  }
  
  return <div>欢迎, {user.name}</div>;
};
```

---

### 5. 列表渲染

**用途**：渲染数组数据

```jsx
const MyComponent = () => {
  const items = ["苹果", "香蕉", "橙子"];

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};
```

---

## 🎯 实际项目示例

### 示例：登录组件（login-component.js）

```jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import "./LoginComponent.css";  // 导入 CSS

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  
  // JS：状态管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // JS：事件处理函数
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // JS：登录逻辑
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      let response = await AuthService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      setMessage(e.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">  {/* CSS 类名 */}
      {message && (
        <div className="alert alert-danger">{message}</div>
      )}
      
      <input
        className="form-control"  {/* CSS 类名 */}
        style={{ marginBottom: "10px" }}  {/* 内联样式 */}
        onChange={handleEmail}
        type="text"
        name="email"
      />
      
      <button
        className="btn btn-primary"
        onClick={handleLogin}
        disabled={isLoading}  {/* JS 逻辑控制属性 */}
      >
        {isLoading ? "登录中..." : "登入系統"}  {/* JS 条件渲染 */}
      </button>
    </div>
  );
};

export default LoginComponent;
```

---

## 📋 总结

### CSS 修改优先级建议：
1. **简单样式** → 内联样式 `style={{}}`
2. **常用方式** → 导入 CSS 文件 `import "./xxx.css"`
3. **大型项目** → CSS Modules `import styles from "./xxx.module.css"`
4. **动态样式** → styled-components 或内联样式 + JS 逻辑

### JS 修改核心概念：
- **状态** → `useState`
- **副作用** → `useEffect`
- **事件** → `onClick`, `onChange` 等
- **条件渲染** → `{condition && <div>}` 或三元运算符
- **列表渲染** → `{array.map(item => ...)}`

---

## 🔗 相关文件

- `client/src/components/home-component.js` - 主页组件示例
- `client/src/components/HomeComponent.css` - CSS 文件示例
- `client/src/components/HomeComponent.example.js` - 完整示例代码
