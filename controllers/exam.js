//Exam Controller
var Year = require('../models/year');
var Course = require('../models/course');
var Building = require('../models/building');
var Exam = require('../models/exam');
const Teacher = require('../models/teacher');
const Staff = require('../models/staff');


module.exports = {
    index: async function (req, res) {
        var year = await Year.findOne({ type: "on" })
        var course = await Course.find({ year: year.year, term: year.term }).populate('teacher').populate('student').exec();

        Exam.aggregate([{
            "$lookup": {
                "from": "course",
                "localField": "course",
                "foreignField": "_id",
                "as": "course"
            }
        },
        {
            "$match": {
                "course.year": year.year,
                "course.term": year.term
            }
        }
        ]).exec(function (err, exam) {
            // console.log(exam[0]);
            res.render('page/exam', { result: course, exam: exam, year: year });
        });


    },
    addExam: async function (req, res) {
        var course = await Course.findOne({ _id: req.params.id })
        var building = await Building.find({});
        var arrayRoom = []
        var dateTime = {}
        res.render('page/addExam', { result: building, course: course, room: arrayRoom, dateTime: dateTime });
    },

    roomExam: async function (req, res) {
        var build = await Building.find();
        var building = await Building.find({});
        var course = await Course.findOne({ _id: req.params.id })
        // --------- date --------- //
        var date = new Date(req.body.date);

        var start = req.body.timestart.split(":");
        var timeStart = new Date(req.body.date);
        timeStart.setHours(start[0])
        timeStart.setMinutes(start[1])

        var end = req.body.timeend.split(":");
        var timeEnd = new Date(req.body.date);
        timeEnd.setHours(end[0])
        timeEnd.setMinutes(end[1])
        // --------- date --------- //

        var dateTime = {
            date: date,
            timeStart: timeStart,
            timeEnd: timeEnd,
            namebuilding: req.body.building
        }
        var exam = await Exam.aggregate([{
            "$unwind": "$exam"
        },
        {
            "$match": {
                "date": date,
                "$and": [
                    { "$and": [{ "timestart": { $lte: timeEnd } }, { "timeend": { $gte: timeStart } }] },
                ],
            }

        }, {
            $project: {
                "exam.room": 1,
                student: { $cond: { if: { $isArray: "$exam.students" }, then: { $size: "$exam.students" }, else: 0 } }
            }
        },
        {
            '$group': {
                "_id": "$exam.room",
                "count": { $sum: "$student" },
            }
        }
        ]);


        // console.log(exam);
        


        var examEqual = await Exam.aggregate([{
            "$unwind": "$exam"
        },
        {
            "$match": {
                "date": date,
                "$and": [{ "timestart": timeStart }, { "timeend": timeEnd }],
            }

        }, {
            $project: {
                "exam.room": 1,
                student: { $cond: { if: { $isArray: "$exam.students" }, then: { $size: "$exam.students" }, else: 0 } }
            }
        },
        {
            '$group': {
                "_id": "$exam.room",
                "count": { $sum: "$student" },
            }
        }
        ]);




        var arrayRoom = []
        for (var j = 0; j < build.length; j++) {
            for (var i = 0; i < build[j].room.length; i++) {
                // console.log(j + " " + i);
                arrayRoom.push({
                    _id: build[j].room[i]._id,
                    namebuilding: build[j].namebuilding,
                    name: build[j].room[i].no,
                    row: build[j].room[i].row,
                    col: build[j].room[i].column,
                    usage: 0,
                    status: true
                });
            }
        }


        console.log(examEqual);

        for (let j = 0; j < exam.length; j++) {
            for (let i = 0; i < arrayRoom.length; i++) {
                if (exam[j]._id == arrayRoom[i].name) {
                    arrayRoom[i].usage = exam[j].count;
                    arrayRoom[i].status = false;
                }

            }
        }

        for (let j = 0; j < examEqual.length; j++) {
            for (let i = 0; i < arrayRoom.length; i++) {
                if (examEqual[j]._id == arrayRoom[i].name) {
                    arrayRoom[i].usage = examEqual[j].count;
                    arrayRoom[i].status = true;
                }

            }
        }

        console.log(arrayRoom);

        res.render('page/addExam', { result: building, course: course, room: arrayRoom, dateTime: dateTime });


    },


    insertExam: async function (req, res) {
        // ---------------------- Student
        var course = await Course.findOne({ _id: req.body.course });
        var roomInput = [];
        var room = [];
        var CourseStudent = new Array(course.student.length);
        for (i = 0; i < CourseStudent.length; i++) {
            CourseStudent[i] = course.student[i];
        }
        // ---------------------- Student



        // ---------------------- Date
        var date = new Date(req.body.date);
        var timeStart = new Date(req.body.timestart);
        var timeEnd = new Date(req.body.timeend);
        // ---------------------- Date


        // ---------------------- Input
        var arrayInput = []
        if (!Array.isArray(req.body.count)) {
            var split = req.body.room.split("-");
            arrayInput.push({
                room: split[1],
                count: split[0],
                row: req.body.row,
                col: req.body.col,
            })
        } else {
            for (i = 0; i < req.body.room.length; i++) {
                var split = req.body.room[i].split("-");
                arrayInput.push({
                    room: split[1],
                    building: split[0],
                    count: req.body.count[i],
                    row: req.body.row[i],
                    col: req.body.col[i],
                })
            }
        }
        // ---------------------- Input

        //console.log(arrayInput);



        var test = await Exam.aggregate([{
            "$unwind": "$exam"
        },
        {
            "$match": {
                "date": date,
                "$and": [
                    { "$and": [{ "timestart": { $lte: timeEnd } }, { "timeend": { $gte: timeStart } }] },
                ],
            }

        }, {
            $project: {
                "exam.room": 1,
                rc: { row: "$exam.students.row", col: "$exam.students.col" }
            },
        }, {
            '$group': {
                "_id": "$exam.room",
                row: { $push: "$rc.row" },
                col: { $push: "$rc.col" }
            }
        }
        ]);


        for (let i = 0; i < arrayInput.length; i++) {
            var arrayRoom = [];
            for (var j = 0; j < arrayInput[i].col; j++) {
                var Room = []
                for (var k = 0; k < arrayInput[i].row; k++) {
                    Room[k] = true;
                }
                arrayRoom.push(Room)
            }
            // console.log("-------------------")
            // console.log(arrayRoom);

            for (let j = 0; j < test.length; j++) {
                if (test[j]._id == arrayInput[i].room) {
                    for (let k = 0; k < test[j].row.length; k++) {
                        for (let y = 0; y < test[j].row[k].length; y++) {
                            row = test[j].row[k][y];
                            col = test[j].col[k][y];
                            arrayRoom[row][col] = false;
                        }

                    }
                }
            }
            // console.log("-------------------")
            // console.log(arrayRoom);


            var count = 0;
            var students = [];
            for (let c = 0; c < arrayInput[i].col; c++) {
                for (let r = 0; r < arrayInput[i].row; r++) {
                    if (count == parseInt(req.body.count[i])) {
                        break;
                    } else {
                        if (arrayRoom[r][c]) {
                            count++;
                            students.push({
                                student: CourseStudent[0],
                                row: r,
                                col: c
                            })
                            CourseStudent.shift();
                        }
                    }
                }
                if (count == parseInt(req.body.count[i])) {
                    break;
                }
            }
            room.push(students);

        }

        // console.log(room);

        for (i = 0; i < arrayInput.length; i++) {
            roomInput.push({
                building: arrayInput[i].building,
                room: arrayInput[i].room,
                students: room[i],
            });
        }

        var newExam = await new Exam({
            course: req.body.course,
            topic: req.body.topic,
            detail: req.body.detail,
            date: date,
            timestart: timeStart,
            timeend: timeEnd,
            type: "รอประกาศ",
            exam: roomInput
        })
        // console.log(newExam);


        newExam.save((err, data) => {
            if (err) { console.log(err) }
            console.log(data);
            res.redirect('/exam/examDetail/' + data._id);
        });
    },

    examDetail: async function (req, res) {
        var teacher = await Teacher.find();
        var staff = await Staff.find();
        var examiner = []
        Exam.findOne({ _id: req.params.id }).populate({ path: 'course', populate: [{ path: 'teacher' }, { path: 'student' }] }).populate({ path: 'exam.students.student' }).exec(function (err, result) {
            for (let i = 0; i < result.exam.length; i++) {
                for (let j = 0; j < result.exam[i].examiner.length; j++) {
                    if (result.exam[i].examiner[j].type == "teacher") {
                        for (let k = 0; k < teacher.length; k++) {
                            if (teacher[k]._id == result.exam[i].examiner[j].id) {
                                examiner.push({
                                    room: result.exam[i].room,
                                    name: teacher[k].firstname,
                                    lastname: teacher[k].lastname,
                                })
                                break;
                            }
                        }
                    } else {
                        for (let k = 0; k < staff.length; k++) {
                            if (staff[k]._id == result.exam[i].examiner[j].id) {
                                examiner.push({
                                    room: result.exam[i].room,
                                    name: staff[k].firstname,
                                    lastname: staff[k].lastname,
                                })
                                break;
                            }
                        }
                    }
                }
            }
            console.log(examiner);
            res.render('page/examDetail', { result: result, teacher: teacher, staff: staff ,examiner : examiner})
        });
    },

    manageExam: async function (req, res) {
        const courseModel = await Course.findOne({ _id: req.params.id }).populate('teacher').populate('student')

        Exam.find({ course: req.params.id}, await function (err, person) {
            for(let i = 0 ; i<person.length ; i++){
                for (let j = 0; j < person[i].exam.length; j++) {
                    console.log(person[i].exam[j]);
                    
                    
                }
                // console.log(person[i]);
                
            }
          
            res.render('page/manageExam', { result: courseModel , result2: person });
        });
        
    },


    // Delect Exam
    examDel: async function (req, res) {
        Exam.findOne({ _id: req.params.id }, await function (err, person) {
            person.remove(() => {
                res.redirect('/exam');
            });
        });
    },
    examAddExaminer: async function (req, res) {
        Exam.findOne({ _id: req.params.id }, await function (err, person) {
            console.log(person);
            for (var i = 0; i < person.exam.length; i++) {
                if (person.exam[i].room == req.body.room) {
                    person.exam[i].examiner.push({
                        id: req.body.id,
                        type: req.body.type
                    });
                    break;
                }
            }
            person.save((err, data) => {
                res.redirect('/exam/examDetail/' + person._id);
            });
        })
    },
    editTypeExam:async function(req,res){
        Exam.findOne({ _id: req.params.id }, await function (err, person) {
            person.type = req.body.typeExam;
            person.save((err, data) => {
                res.redirect('/exam');
            });
        })
    }
}