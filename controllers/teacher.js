//Teacher Controller
const ExcelReader = require('node-excel-stream').ExcelReader;
const Teacher = require('../models/teacher');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    index: async function (req, res) {
        Teacher.find({}, await
            function (err, result) {
                if (err) { console.log(err) }
                res.render('page/teacher', { result: result })
            });
    },

    addTeacher: function (req, res) {
        res.render('page/addTeacher');
    },

    insertTeacher: function (req, res) {

        const newTeacher = new Teacher({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            address: req.body.address,
            position: req.body.position,
            phone: req.body.phone,
            email: req.body.email,
        });
      
        User.findOne({ username: req.body.username },async function (err, person) {
            if (person) {
                console.log('username is already to use');
                res.redirect('/teacher/addTeacher');

            } else {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(req.body.password, salt);
        
                newTeacher.save((err) => {
                    const newUser = new User({
                        username: req.body.username,
                        password: passwordHash,
                        type: "teacher",
                        id: newTeacher._id
                    })

                    newUser.save((err) => {
                        res.redirect('/teacher');
                    });
                });

            }
        });
    },

    deleteTeacher: async function (req, res) {

        Teacher.findOne({ _id: req.params._id }, await
            function (err, teacher) {
                teacher.remove();
            });

        User.findOne({ id: req.params._id }, await
            function (err, user) {
                user.remove(() => {
                    res.redirect('/teacher');
                });

            });
    },

    viewDetail: async function (req, res) {
        Teacher.findOne({ _id: req.params._id }, await
            function (err, teacher) {
                res.render('page/viewTeacher', { result: teacher });
            });
    },


    viewEditDetail: async function (req, res) {
        Teacher.findOne({ _id: req.params._id }, await
            function (err, person) {
                res.render('page/editTeacher', { result: person });
            });
    },

    editTeacher: async function (req, res) {

        Teacher.findOne({ email: req.body.email }, await
            function (err, person) {
                if (person) {
                    person.firstname = req.body.firstname
                    person.lastname = req.body.lastname
                    person.address = req.body.address
                    person.phone = req.body.phone
                    person.position = req.body.position

                    person.save((err) => {
                        res.redirect('/teacher');
                    })
                }
            });
    },

    uploadTeacher: function (req, res) {
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            // console.log(fieldname);

            if (fieldname == "teacher") {
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

                    let newTeacher = new Teacher(rowData);
                    let newUsername = new User(rowData);

                    Teacher.findOne({ username: newUsername.username }, async function (err, person) {
                        if (person) {
                            console.log('username is already to use');
                            res.redirect('/teacher/addTeacher');
                        } else {
                            const salt = await bcrypt.genSalt(10);
                            const passwordHash = await bcrypt.hash(newUsername.password, salt);

                            newTeacher.save((err) => {
                                // console.log(newTeacher);
                                
                                const newUser = new User({
                                    username: newUsername.username,
                                    password: passwordHash,
                                    type: "teacher",
                                    id: newTeacher._id
                                })

                                newUser.save()
                            });
                        }
                    })

                }).then(() => {
                    console.log('done parsing : ' + fieldname);
                    res.redirect('/teacher');
                });
            }
        });

    }
}