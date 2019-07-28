module.exports = {
    checkLogin: (req, res, next) => {
        // console.log(req.session.login);
        
        if (req.session.login == undefined) {
            return res.redirect('/');

        } else {
            next();
        }
    },

    checkType: (req, res, next) => {
        // console.log(req.session.login);
        if (req.session.login.type == "staff" || req.session.login.type == "teacher") {
            next();
        } else {
            return res.redirect('/home');
        }

    },

    checkStudent: (req, res, next) => {
        // console.log(req.session.login);
        if (req.session.login.type != "student") {
            return res.redirect('/home');

        } else {
            next();
        }

    },

    checkTeacher: (req, res, next) => {
        // console.log(req.session.login);

        if (req.session.login.type != "teacher") {
            return res.redirect('/home');

        } else {
            next();
        }

    },

};