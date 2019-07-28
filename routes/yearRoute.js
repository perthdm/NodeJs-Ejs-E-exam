const router = require('express').Router();
const yearController = require('../controllers/year');

router.route('/').get(yearController.index);
router.route('/addYear').post(yearController.addYear);
router.route('/check/:_id').get(yearController.check);
router.route('/del/:_id').get(yearController.del);
module.exports = router;