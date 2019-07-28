const router = require('express').Router();
const studentController = require('../controllers/student');
const auth = require('../auth/auth');

router.route('/').get(studentController.index);
router.route('/addStudent').get(studentController.addStudent);
router.route('/upload').post(studentController.uploadStudent);
// router.route('/viewPerPage/:current').get(studentController.viewPerPage);

router.route('/addStudent/submit').post(studentController.insertStudent);
router.route('/delete/:_id').get(studentController.deleteStudent);
router.route('/view/:_id').get(studentController.viewDetail);

router.route('/edit/:_id').get(studentController.viewEditDetail);
router.route('/edit/submit').post(studentController.editStudent);

router.route('/subjectExam').get(auth.checkStudent, studentController.subjectExam);
router.route('/subjectExam/room/:_idSubject').get(auth.checkStudent, studentController.viewRoomExam);



// <--------   Auth Version -------->
// router.route('/').get(auth.checkStaff, studentController.index);
// router.route('/addStudent').get(auth.checkStaff, studentController.addStudent);
// router.route('/upload').post(auth.checkStaff, studentController.uploadStudent);
// router.route('/viewPerPage/:current').get(auth.checkStaff, studentController.viewPerPage);

// router.route('/addStudent/submit').post(auth.checkStaff, studentController.insertStudent);
// router.route('/delete/:_id').get(auth.checkStaff, studentController.deleteStudent);
// router.route('/view/:_id').get(auth.checkStaff, studentController.viewDetail);

// router.route('/edit/:_id').get(studentController.viewEditDetail);
// router.route('/edit/submit').post(studentController.editStudent);

// router.route('/subjectExam').get(auth.checkStudent, studentController.subjectExam);
// router.route('/subjectExam/room/:_idSubject').get(auth,checkStudent, studentController.viewRoomExam);
// <--------   Auth Version -------->

module.exports = router;