const router = require('express').Router();
const loginController = require('../controllers/login')

router.route('/').get(loginController.index);
router.route('/login').post(loginController.login);
router.route('/logout').get(loginController.logout);

module.exports = router;


