const router = require('express').Router();
const teacherController = require('../controllers/teacher');
const auth = require('../auth/auth');

router.route('/').get(teacherController.index);
router.route('/addTeacher').get(teacherController.addTeacher);
router.route('/upload').post(teacherController.uploadTeacher);
router.route('/addTeacher/submit').post(teacherController.insertTeacher);
router.route('/delete/:_id').get(teacherController.deleteTeacher);
router.route('/view/:_id').get(teacherController.viewDetail);

router.route('/edit/:_id').get(teacherController.viewEditDetail);
router.route('/edit/submit').post(teacherController.editTeacher);


// <--------   Auth Version -------->
// router.route('/').get(auth.checkTeacher ,teacherController.index);
// router.route('/addTeacher').get(auth.checkTeacher ,teacherController.addTeacher);
// router.route('/addTeacher/submit').post(auth.checkTeacher ,teacherController.insertTeacher);
// router.route('/upload').post(auth.checkTeacher ,teacherController.uploadTeacher);
// router.route('/delete/:_id').get(auth.checkTeacher ,teacherController.deleteTeacher);
// router.route('/view/:_id').get(auth.checkTeacher ,teacherController.viewDetail);

// router.route('/edit/:_id').get(teacherController.viewEditDetail);
// router.route('/edit/submit').post(teacherController.editTeacher);


module.exports = router;