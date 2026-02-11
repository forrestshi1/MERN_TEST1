const mongoose = require('mongoose');
const { Schema } = mongoose;//从mongoose中解构出Schema类.等价于const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,

    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'instructor'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


//instance methods
userSchema.methods.isStudent = function () {
    return this.role === 'student';
}
userSchema.methods.isInstructor = function () {
    return this.role === 'instructor';
}

//middleware
//如果使用者为新用户，或者正在更改密码，则对密码进行杂凑处理


userSchema.pre('save', async function (next) {//当一个 user 文档执行 save() 时，会 自动先执行 pre('save') 里面注册的函数，然后才真正写入数据库。
    //this代表MongoDB中的文档对象
    if (this.isNew || this.isModified('password')) {
        // 使用 bcrypt 对密码进行哈希处理 第一个参数：明文密码 第二个参数：salt 轮数（10 是常用安全值） 返回值是不可逆的哈希字符串
        const hashValue = await bcrypt.hash(this.password, 10);
        this.password = hashValue;
    }
    next();
});

userSchema.methods.comparePassword = async function (password,cb) {
        // 使用 bcrypt 对密码进行比较 第一个参数：明文密码 第二个参数：哈希字符串 返回值是布尔值
        let isMatch = await bcrypt.compare(password, this.password);
        return cb(null, isMatch);//cb在这里表示调用传进来的函数，传参为null和ismatch

}

module.exports = mongoose.model('User', userSchema);//导出模型,user是模型名称，Mongoose 会自动转换为集合名：users
// ,userSchema是模型的架构，mongoose.model()方法会根据架构创建一个模型类，该类可以用来创建文档实例