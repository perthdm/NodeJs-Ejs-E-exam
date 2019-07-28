//Student Controller
const ExcelReader = require('node-excel-stream').ExcelReader;
const Student = require('../models/students');
const Course = require('../models/course');
const Exam = require('../models/exam');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
async function hashCode(password) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
}

module.exports = {
    hashCode: hashCode,
    index: async function (req, res) {
        // let currentPage = 1
        // let max = 10

        // let studentLimit = await Student.find().limit(max)
        // let countStudent = await Student.find().count()

        // res.render('page/student', {
        //     result: studentLimit,
        //     current: currentPage,
        //     pages: Math.ceil(countStudent / max)
        // })

        Student.find({},await function(err,person){
            res.render('page/student' ,{result :person})
        });

    },

    viewPerPage: async function (req, res) {
        let currentPage = req.params.current
        let max = 10
        let studentLimit = await Student.find().skip((max * currentPage) - max).limit(max)
        let countStudent = await Student.find().count()

        res.render('page/student', {
            result: studentLimit,
            current: currentPage,
            pages: Math.ceil(countStudent / max)
        })
    },

    addStudent: function (req, res) {
        res.render('page/addStudent');
    },

    insertStudent: async function (req, res) {

        const newStudent = new Student({
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            faculty: req.body.faculty,
        });

        const passwordHash = await hashCode(req.body.password);

        User.findOne({ username: req.body.username }, function (err, person) {
            if (person) {
                console.log('username is already to use');
                res.redirect('/student/addStudent');
            } else {
                newStudent.save((err) => {
                    const newUser = new User({
                        username: req.body.username,
                        password: passwordHash,
                        type: "student",
                        id: newStudent._id
                    })

                    newUser.save((err) => {
                        res.redirect('/student');
                    });
                });

            }
        });
    },

    deleteStudent: async function (req, res) {
        Student.findOne({ _id: req.params._id }, await function (err, student) {
                student.remove();
            });

        User.findOne({ id: req.params._id }, await function (err, user) {
                user.remove();
                res.redirect('/student');
            });
    },

    viewDetail: async function (req, res) {
        Student.findOne({ _id: req.params._id }, await function (err, student) {
                res.render('page/viewStudent', { result: student });
            });
    },

    viewEditDetail: async function (req, res) {
        Student.findOne({ _id: req.params._id }, await function (err, student) {
                res.render('page/editStudent', { result: student });
            });
    },

    editStudent: async function (req, res) {
        Student.findOne({ id: req.body.id }, await function (err, student) {
                student.firstname = req.body.firstname,
                    student.lastname = req.body.lastname,
                    student.address = req.body.address,
                    student.phone = req.body.phone,
                    student.email = req.body.email,
                    student.faculty = req.body.faculty

                student.save((err, data) => {
                    res.redirect('/student');
                });

            });
    },

    subjectExam: async function (req, res) {
        Course.find({ student: req.session.login.obj[0]._id }, await function (err, person) {
            // console.log(person)

            res.render('page/subjectExam', { result: person });
        });

    },

    viewRoomExam: async function (req, res) {
        var course = await Course.findOne({ _id: req.params._idSubject });
        console.log(course);

        Exam.find({ course: req.params._idSubject, "exam.students.student": req.session.login.obj[0]._id }).populate({ path: 'exam.students.student' }).exec(await function (err, person) {
            for (let i = 0; i < person.length; i++) {
                for (let j = 0; j < person[i].exam.length; j++) {
                    for (let k = 0; k < person[i].exam[j].students.length; k++) {
                        if (person[i].exam[j].students[k].student._id == req.session.login.obj[0]._id) {
                            console.log(person[i].exam[j].room)

                        }
                    }
                }
            }
            res.render('page/viewRoomExam', { result: person, course: course })
        });
    },

    uploadStudent: function (req, res) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log(fieldname);

            if (fieldname == "student") {
                let fileStudent = file;
                let reader = new ExcelReader(fileStudent, {
                    sheets: [{
                        name: 'Sheet1',
                        rows: {
                            headerRow: 1,
                            allowedHeaders: [
                                { name: 'id', key: 'id' },
                                { name: 'firstname', key: 'firstname' },
                                { name: 'lastname', key: 'lastname' },
                                { name: 'username', key: 'username' },
                                { name: 'password', key: 'password' },
                                { name: 'address', key: 'address' },
                                { name: 'phone', key: 'phone' },
                                { name: 'email', key: 'email' },
                                { name: 'faculty', key: 'faculty' }
                            ]
                        }
                    }]
                })

                console.log('starting parse : ' + fieldname);
                reader.eachRow(async (rowData, rowNum, sheetSchema) => {

                    let newStudent = new Student(rowData);
                    let newUsername = new User(rowData);

                    User.findOne({ username: newUsername.username }, async function (err, person) {
                        if (person) {
                            console.log('username is already to use');
                        } else {
                            const salt = await bcrypt.genSalt(10);
                            const passwordHash = await bcrypt.hash(newUsername.password, salt);

                            newStudent.save((err) => {
                                const newUser = new User({
                                    username: newUsername.username,
                                    password: passwordHash,
                                    type: "student",
                                    id: newStudent._id
                                })

                                newUser.save()
                            });
                        }
                    })

                }).then(() => {
                    console.log('done parsing : ' + fieldname);
                    res.redirect('/student');
                });
            }
        });
    }
} 