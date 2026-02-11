const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require("./routes").auth;//

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRoute);//把 authRoute 这个路由挂载到 /api/user 这个路径前缀下。

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});//不用3000因为react默认端口是3000,当server.js运行时，就会触发这个箭头函数