const router = require('express').Router();
const registerValidation = require('../validation').registerValidation;
const loginValidation = require('../validation').loginValidation;
const { use } = require('passport');
const { User } = require('../models');//这么写回去index里自动找user-model.js
const jwt = require('jsonwebtoken');

router.use((req, res, next) => {
    console.log('正在接收一个跟auth相关的请求');
    next();
});

router.get('/testAPI', (req, res) => {
   return res.send('auth test Success');
});

router.post('/register', async (req, res) => {
   //校验req.body是否符合registerValidation的规则
    const { error } = registerValidation(req.body);
   
    if (error) return res.status(400).send(error.details[0].message);

    //校验email是否已被注册
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //创建一个新用户
    let { username, email, password, role } = req.body;
    let newUser = new User({
        username,
        email,
        password,
        role,
    });
    //保存新用户到数据库
    try{
        let savedUser = await newUser.save();
        return res.send({
            msg: "注册成功",
            savedUser,
        });
    }catch(e){
        return res.status(500).send("无法储存使用者" + e);
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const foundUser = await User.findOne({ email: req.body.email });//User 是 Mongoose 模型，findOne 查询数据库后返回匹配的那条用户记录，赋值给 foundUser。
    if (!foundUser) {
        return res.status(401).send('Email not found');
    }

    // 直接 await，不再用回调
    const isMatch = await foundUser.comparePassword(req.body.password);

    if (isMatch) {
        const tokenObject = { _id: foundUser._id, email: foundUser.email };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: '7d' });
        return res.send({
            msg: "登录成功",
            token: "JWT " + token,
            user: foundUser,
        });
    } else {
        return res.status(401).send('Password incorrect');
    }
});
module.exports = router;