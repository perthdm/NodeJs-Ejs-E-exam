const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    year: {
        type: String,
    },
    term: {
        type: String,
    },
    idSubject: {
        type: String,
    },
    subject: {
        type: String,
    },
    teacher: [{
        type: Schema.Types.ObjectId,
        ref: "teacher"
    }],
    student: [{
        type: Schema.Types.ObjectId,
        ref: "student"
    }]
});

const Course = mongoose.model('course', courseSchema, 'course');

module.exports = Course;