const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "course"
    },
    topic: {
        type: String
    },
    detail: {
        type: String
    },
    date: {
        type: Date
    },
    timestart: {
        type: Date
    },
    timeend: {
        type: Date
    },
    type:{
        type: String // รอประกาศ   ประกาศแล้ว
    },
    exam: [{
        building: {
            type: String
        },
        room: {
            type: String
        },
        students: [{
            student: {
                type: Schema.Types.ObjectId,
                ref: "student"
            },
            col: Number,
            row: Number

        }],
        examiner: [{
            id: {
                type: String,
            },
            type: {
                type: String,
            }
        }]
    }]

});

const Exam = mongoose.model('exam', examSchema, 'exam');
module.exports = Exam;