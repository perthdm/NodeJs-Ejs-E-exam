const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teacherSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    position:{
        type: String,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    }
});


const Teacher = mongoose.model('teacher', teacherSchema ,'teacher');

module.exports = Teacher;

