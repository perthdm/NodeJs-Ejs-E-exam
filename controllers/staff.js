// Staff Controller
const ExcelReader = require('node-excel-stream').ExcelReader;
const Staff = require('../models/staff');
const User = require('../models/user');
const Course = require('../models/course');
const Year = require('../models/year')
const Exam = require('../models/exam')
const bcrypt = require('bcryptjs');

module.exports = {
    index: async function (req, res) {
        Staff.find({}, await
            function (err, result) {
                if (err) { console.log(err) }
                res.render('page/staff', { result: result });
            });

    },

    addStaff: function (req, res) {
        res.render('page/addStaff');
    },

    insertStaff: async function (req, res) {
        const newStaff = new Staff({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            birthday: req.body.birthday,
            position: req.body.position,
            phone: req.body.phone,
            email: req.body.email,
        });


        User.findOne({ username: req.body.username },async function (err, person) {
            if (person) {
                console.log('username is already to use');
                res.redirect('/staff/addStaff');
            } else {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(req.body.password, salt);

                newStaff.save((err) => {
                    const newUser = new User({
                        username: req.body.username,
                        password: passwordHash,
                        type: "staff",
                        id: newStaff._id
                    })

                    newUser.save((err) => {
                        res.redirect('/staff');
                    });
                });

            }
        });
    },

    deleteStaff: async function (req, res) {

        Staff.findOne({ _id: req.params._id }, await
            function (err, staff) {
                staff.remove();
            });

        User.findOne({ id: req.params._id }, await
            function (err, user) {
                user.remove(() => {
                    res.redirect('/staff');
                });

            });
    },
    viewDetail: async function (req, res) {
        Staff.findOne({ _id: req.params._id }, await
            function (err, staff) {
                res.render('page/viewStaff', { result: staff });
            });
    },

    viewEditDetail: async function (req, res) {
        console.log(req.params._id);

        Staff.findOne({ _id: req.params._id }, await
            function (err, person) {
                res.render('page/editStaff', { result: person });
            });
    },

    editStaff: async function (req, res) {
        console.log(req.body.email);

        Staff.findOne({ email: req.body.email }, await
            function (err, person) {
                if (person) {
                    person.firstname = req.body.firstname
                    person.lastname = req.body.lastname
                    person.address = req.body.address
                    person.phone = req.body.phone
                    person.position = req.body.position

                    person.save((err) => {
                        res.redirect('/staff');
                    })
                }
            });
    },

    uploadStaff: function (req, res) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            if (fieldname == "staff") {
                let fileStudent = file;
                let reader = new ExcelReader(fileStudent, {
                    sheets: [{
                        name: 'Sheet1',
                        rows: {
                            headerRow: 1,
                            allowedHeaders: [
                                { name: 'firstname', key: 'firstname' },
                                { name: 'lastname', key: 'lastname' },
                                { name: 'username', key: 'username' },
                                { name: 'password', key: 'password' },
                                { name: 'address', key: 'address' },
                                { name: 'position', key: 'position' },
                                { name: 'phone', key: 'phone' },
                                { name: 'email', key: 'email' }
                            ]
                        }
                    }]
                })

                console.log('starting parse : ' + fieldname);
                reader.eachRow(async (rowData, rowNum, sheetSchema) => {

                    let newStaff = new Staff(rowData);
                    let newUsername = new User(rowData);

                    User.findOne({ username: newUsername.username }, async function (err, person) {
                        if (person) {
                            console.log('username is already to use');
                            res.redirect('/staff/addStaff');
                        } else {
                            const salt = await bcrypt.genSalt(10);
                            const passwordHash = await bcrypt.hash(newUsername.password, salt);

                            newStaff.save((err) => {
                                const newUser = new User({
                                    username: newUsername.username,
                                    password: passwordHash,
                                    type: "staff",
                                    id: newStaff._id
                                })

                                newUser.save();
                            });

                        }
                    });

                }).then(() => {
                    console.log('done parsing : ' + fieldname);
                    res.redirect('/staff');
                });
            }
        });

    },

    viewExaminer: async function (req, res) {
        const yearModel = await Year.findOne({ type: 'on' })
        Course.find({ year: yearModel.year, term: yearModel.term }, await function (err, data) {
            res.render('page/examiner', { result: data });
        });

    },

    viewRoomExaminer: async function (req, res) {
        Exam.find({ course: req.params._idSubject, "exam.examiner.id": req.session.login.obj[0]._id }).exec(await function (err, person) {
            res.render('page/viewRoomExaminer', { result: person })
            // console.log("=======================================================================");
            // for (let i = 0; i < person.length; i++) {
            //     for (let j = 0; j < person[i].exam.length; j++) {
            //         for (let k = 0; k < person[i].exam[j].examiner.length; k++) {
            //             if (person[i].exam[j].examiner[k].id == req.session.login.obj[0]._id) {
            //                 console.log(person[i].exam[j].room)
            //             }
            //         }
            //     }
            // }
            // console.log("=======================================================================");
        });
    },

}