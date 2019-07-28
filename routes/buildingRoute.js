const router = require('express').Router();
const buildingController = require('../controllers/building')


router.route('/').get(buildingController.index);
// <---------------- Building ---------------->
//insert building
router.route('/addBuilding').get(buildingController.addBuilding);
router.route('/addBuilding/submit').post(buildingController.insertBuilding)

//view detail building (Room)
router.route('/view/:id').get(buildingController.viewDetail);

//delete building
router.route('/delete/:id').get(buildingController.deleteBuilding);

//edit detail building
router.route('/edit/:id').get(buildingController.viewEditDetail);
router.route('/edit/submit').post(buildingController.editBuilding);
// <---------------- Building ---------------->



// <---------------- Room ---------------->
//insert room
router.route('/addRoom/submit/:id').post(buildingController.insertRoom)

//edit room
router.route('/room/edit/:_idBuilding/:id').get(buildingController.viewEditRoom)
router.route('/room/edit/submit').post(buildingController.editRoom);

//remove room
router.route('/room/delete/:_idBuilding/:id').get(buildingController.deleteRoom)
// <---------------- Room ---------------->

module.exports = router;