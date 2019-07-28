const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const Mstore = require('connect-mongo')(session)
const bcrypt = require('bcryptjs');
const busboy = require('connect-busboy')
const auth = require('./auth/auth');
const Student = require('./models/students');
const Teacher = require('./models/teacher');
const Staff = require('./models/staff');
const Building = require('./models/building');

// mongoose.connect('mongodb+srv://test:p@ssw0rd@cluster0-muae2.mongodb.net/EEAM?retryWrites=true')
mongoose.connect('mongodb://perthdm:123456d@ds115340.mlab.com:15340/exam')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    store: new Mstore({ mongooseConnection: mongoose.connection })
}));

app.set('view engine', 'ejs')
app.use(busboy({ immediate: true }));

app.use((req, res, next) => {
    res.locals.sess = req.session.login;
    next();
})

app.get('/home', async (req, res) => {
    var student = await Student.count();
    var teacher = await Teacher.count();
    var staff = await Staff.count();
    var building = await Building.aggregate([
        {
            $project: {
                namebuilding: 1,
                room: { $cond: { if: { $isArray: "$room" }, then: { $size: "$room" }, else: 0 } }
            }
        }
    ]);
    var nameBuilding = [];
    var room = [];
    for (let i = 0; i < building.length; i++) {
        nameBuilding[i] = building[i].namebuilding;
        room[i] = building[i].room;
    }
    res.render('page/home', { sess: res.locals.sess, student, teacher, staff, nameBuilding, room, building })
})

// <--------   Auth Version -------->
app.use('/', require('./routes/loginRoute'))
app.get('/home',auth.checkLogin, (req, res) => { res.render('page/home') })
app.use('/student', auth.checkLogin, require('./routes/studentRoute'))
app.use('/teacher', auth.checkLogin, auth.checkType, require('./routes/teacherRoute'))
app.use('/staff', auth.checkLogin, require('./routes/staffRoute'))
app.use('/building', auth.checkLogin,  require('./routes/buildingRoute'))
app.use('/exam', auth.checkLogin, require('./routes/examRoute'))
app.use('/year', auth.checkLogin, require('./routes/yearRoute'))
app.use('/course', auth.checkLogin, require('./routes/courseRoute'))
// <--------   Auth Version -------->

app.listen(7078, () => {
    console.log('Running at port: ' + 7078)
})