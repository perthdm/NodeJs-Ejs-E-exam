// login Controller
const User = require('../models/user')
const Staff = require('../models/staff')
const Teacher = require('../models/teacher')
const Student = require('../models/students')
const bcrypt = require('bcryptjs');
const session = require('express-session')

async function mathPassword(password, passwordDB) {
    let test = await bcrypt.compare(password, passwordDB);
    if (test) {
        return true;
    }
    else {
        return false;
    }
}



module.exports = {
    mathPassword: mathPassword,
    index: function (req, res) {
        res.render('page/login', { status: 0, message: "" })
    },

    login: async function (req, res) {

        User.findOne({ username: req.body.username }, async function (err, person) {
            if (person) {
                //Compare bcrypt and password in DB
                let Check = await mathPassword(req.body.password, person.password);

                if (Check) {
                    var result

                    if (person.type == "student") {
                        result = await Student.find({ _id: person.id })
                    } else if (person.type == "teacher") {
                        result = await Teacher.find({ _id: person.id })
                    } else if (person.type == "staff") {
                        result = await Staff.find({ _id: person.id })
                    }

                    req.session.login = {
                        status: true,
                        obj: result,
                        type: person.type
                    }

                    res.redirect('/home');
                } else {
                    console.log("Password is incorrect");
                    res.render('page/login', { status: 1, message: "Password is incorrect" });
                }
            } else {
                console.log("Username not found");
                res.render('page/login', { status: 1, message: "Username not found" });
            }

        });

    },

    logout: function (req, res) {
        req.session.login = undefined
        res.redirect('/');
    }
}