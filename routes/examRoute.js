const router = require('express').Router()
const examController = require('../controllers/exam')

router.route('/').get(examController.index)
router.route('/addExam/:id').get(examController.addExam)
router.route('/roomExam/:id').post(examController.roomExam)
router.route('/insertExam').post(examController.insertExam)

// Delect Exam
router.route('/examDel/:id').get(examController.examDel)
// Delect Exam

router.route('/examDetail/:id').get(examController.examDetail)
router.route('/examDetail/:id').post(examController.examAddExaminer)

router.route('/editTypeExam/:id').post(examController.editTypeExam)

router.route('/manageExam/:id').get(examController.manageExam)
module.exports = router