const router = require('express').Router();
const registerValidation = require('../validation').registerValidation;
const loginValidation = require('../validation').loginValidation;
const { User } = require('../models');//这么写回去index里自动找user-model.js

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

module.exports = router;