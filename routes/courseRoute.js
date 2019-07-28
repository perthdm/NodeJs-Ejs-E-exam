const router = require('express').Router();
const courseController = require('../controllers/course')

router.route('/').get(courseController.index);
router.route('/').post(courseController.addCourse);
router.route('/addCourse/:_id').get(courseController.addDetailCourse);

router.route('/addTeacher/:_id').post(courseController.addTeacherCourse);
router.route('/addStudent/:_id').post(courseController.addStudentCourse);
router.route('/delCourse/:_id').get(courseController.deleteCourse);
router.route('/uploadStudent/:_id').post(courseController.uploadStudent);


module.exports = router;

