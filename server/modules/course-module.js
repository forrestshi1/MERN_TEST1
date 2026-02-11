const mongoose = require('mongoose');
const { Schema } = mongoose;//从mongoose中解构出Schema类.等价于const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const courseSchema = new Schema({
    id: {
        type: String
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
     price:{
        type: Number,
        required: true,
    },
   instructor:{
        type: mongoose.Schema.Types.ObjectId,//引用用户模型的ObjectId,primary key
        ref: 'User',//引用用户模型
        required: true,
    },
    students:{
        type: [String],//引用用户模型的ObjectId,primary key
        default: [],
    }
    },
);



module.exports = mongoose.model('Course', courseSchema);