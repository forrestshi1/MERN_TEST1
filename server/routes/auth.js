const router = require('express').Router();

router.use((req, res, next) => {
    console.log('正在接收一个跟auth相关的请求');
    next();
});

router.get('/testAPI', (req, res) => {
   return res.send('auth test Success');
});

module.exports = router;