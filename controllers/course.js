const ExcelReader = require('node-excel-stream').ExcelReader;
const Teacher = require('../models/teacher');
const Student = require('../models/students');
const User = require('../models/user');
const Year = require('../models/year');
const Course = require('../models/course');
const bcrypt = require('bcryptjs');

module.exports = {
    index: async function (req, res) {
        var year = await Year.findOne({ type: 'on' });
        var course = await Course.find({year:year.year, term:year.term}).populate('teacher');
        res.render('page/course', { resultYeat: year, result: course });
    },

    addCourse: async function (req, res) {
        const newCourse = new Course({
            year: req.body.year,
            term: req.body.term,
            idSubject: req.body.idSubject,
            subject: req.body.subject,
        })

        newCourse.save((err) => {
            res.redirect('/course');
        })

    },

    addDetailCourse: async function (req, res) {
        var year = await Year.findOne({ type: 'on' })
        var teacher = await Teacher.find()
        var student = await Student.find()
        var course = await Course.findOne({ _id: req.params._id }).populate('teacher').populate('student');
        var checkTeacher = []
        var checkStudent = []

        for(let i=0;i<teacher.length;i++){
            var f = 0;
            for(let j=0;j<course.teacher.length;j++){
                if(teacher[i].email == course.teacher[j].email){
                    f = 1;
                }
            }
            checkTeacher[i] = f;
        }
        
        for(let i=0;i<student.length;i++){
            var f = 0;
            for(let j=0;j<course.student.length;j++){
                if(student[i].id == course.student[j].id){
                    f = 1;
                }
            }
            checkStudent[i] = f;
        }
        

        res.render('page/addCourse', {
            resultYeat: year,
            resultTeacher: teacher,
            resultStudent: student,
            resultCourse: course,
            _idSubject: req.params._id,
            check: checkTeacher,
            checkst: checkStudent
        });
    },

    addTeacherCourse: async function (req, res) {

        Course.findOne({ _id: req.params._id }, await function (err, person) {
            if (req.body.check == null) {
                person.teacher = []
            } else {
                person.teacher = req.body.check
            }


            person.save((err) => {
                if (err) { console.log(err) }
                res.redirect('/course/addCourse/' + req.params._id + '');
            })

        });

    },

    deleteCourse: async function (req, res) {

        Course.findOne({ _id: req.params._id }, await function (err, person) {
            person.remove((err) => {
                if (err) { console.log(err) }
                res.redirect('/course');
            })
        });

    },

    addStudentCourse: async function (req, res) {
        // console.log(req.body.check);

        Course.findOne({ _id: req.params._id }, await function (err, person) {
            if (req.body.check == null) {
                person.student = []
            } else {
                person.student = req.body.check
            }


            person.save((err) => {
                if (err) { console.log(err) }
                res.redirect('/course/addCourse/' + req.params._id + '');
            })

        });

    },

    uploadStudent: async function (req, res) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log(fieldname);

            if (fieldname == "student") {
                let fileStudent = file;
                let reader = new ExcelReader(fileStudent, {
                    sheets: [{
                        name: 'Sheet1',
                        rows: {
                            headerRow: 1,
                            allowedHeaders: [{
                                name: 'id',
                                key: 'id'
                            }, {
                                name: 'firstname',
                                key: 'firstname'
                            }, {
                                name: 'lastname',
                                key: 'lastname'
                            }, {
                                name: 'address',
                                key: 'address'
                            }, {
                                name: 'phone',
                                key: 'phone'
                            }, {
                                name: 'email',
                                key: 'email'
                            }, {
                                name: 'faculty',
                                key: 'faculty'
                            }
                            ]
                        }
                    }]
                })

                console.log('starting parse : ' + fieldname);
                reader.eachRow(async (rowData, rowNum, sheetSchema) => {
                    // console.log(rowData);

                    var student = await Student.findOne({ id: rowData.id });
                    var course = await Course.findOne({ _id: req.params._id });
                    console.log(course);

                    if (student != null) {
                        course.student.push(student._id)
                        course.save()
                    } else {

                        let newStudent = new Student(rowData);
                        console.log("TEST :" + newStudent);

                        const salt = await bcrypt.genSalt(10);
                        const passwordHash = await bcrypt.hash(newStudent.id, salt);

                        newStudent.save((err) => {
                            const newUser = new User({
                                username: newStudent.id,
                                password: passwordHash,
                                type: "student",
                                id: newStudent._id
                            })

                            newUser.save((err) => {
                                console.log(newUser)
                                course.student.push(newStudent._id)
                                course.save()
                            });


                        });

                    }

                }).then(() => {
                    console.log('done parsing : ' + fieldname);
                    res.redirect('/course/addCourse/' + req.params._id + '');
                });
            }

        });
    }







}