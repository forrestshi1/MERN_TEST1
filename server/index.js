const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require("./routes").auth;//引入auth.js文件中的路由
const courseRoute = require("./routes").course;//引入course.js文件中的路由
const passport = require('passport');
require('./config/passport')(passport);//引入passport.js文件中的配置

//connect to db
mongoose
    .connect('mongodb://127.0.0.1:27017/mernDB')
    .then(() => {
    console.log('DB connection success');
})
.catch((e) => {
    console.log(e);
});

//middleware
app.use(express.json());//这行代码是用来解析 JSON 格式的请求体的。
app.use(express.urlencoded({ extended: true }));//extended: true 表示允许解析嵌套的对象。

app.use("/api/user", authRoute);//把 authRoute 这个路由挂载到 /api/user 这个路径前缀下。
//course route应该被jwt保护，如果request中没有包含jwt token，就返回错误
app.use("/api/course", passport.authenticate('jwt', { session: false }), courseRoute);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});//不用3000因为react默认端口是3000,当server.js运行时，就会触发这个箭头函数