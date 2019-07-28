//Room Controller
const Building = require('../models/building');

module.exports = {
    index: async function(req, res) {
        Building.find({}, await
            function(err, result) {
                if (err) { console.log(err) }
                res.render('page/building', { result: result });
            });
    },

    addBuilding: function(req, res) {
        res.render('page/addBuilding');
    },

    insertBuilding: async function(req, res) {
        const newBuilding = new Building({
            namebuilding: req.body.namebuilding,
            fullnamebuilding: req.body.fullnamebuilding,
        });

        Building.findOne({ namebuilding: req.body.namebuilding }, await
            function(err, building) {
                if (building) {
                    console.log("building have in database");
                    res.redirect('/building/addBuilding');
                } else {
                    newBuilding.save((err, person) => {
                        if (err) { console.log(err) }
                        console.log(person);
                        res.redirect('/building');
                    })
                }
            })
    },

    deleteBuilding: async function(req, res) {
        Building.findOne({ _id: req.params.id }, await
            function(err, person) {
                person.remove(() => {
                    res.redirect('/building')
                });
            });
    },

    viewDetail: async function(req, res) {
        Building.findOne({ _id: req.params.id }, await
            function(err, person) {
                res.render('page/viewRoom', { result: person })
            });
    },

    viewEditDetail: async function(req, res) {
        Building.findOne({ _id: req.params.id }, await
            function(err, person) {
                res.render('page/editBuilding', { result: person });
            });
    },

    editBuilding: async function(req, res) {
        
        Building.findOne({ _id: req.body._idBuilding }, await function(err, building) {
                building.fullnamebuilding = req.body.fullnamebuilding

                building.save((err, data) => {
                    console.log(data);
                    res.redirect('/building');
                });
            });
    },

    insertRoom: async function(req, res) {
        Building.findOne({ _id: req.body._idBuilding }, await
            function(err, person) {
                person.room.push({
                    no: req.body.no,
                    capacity: req.body.row * req.body.col,
                    row: req.body.row,
                    column: req.body.col
                })

                person.save((err) => {
                    res.redirect('/building/view/' + person._id + '')
                })
            });
    },

    viewEditRoom: async function(req, res) {
        // console.log(req.params._idBuilding);
        
        Building.findOne({ _id: req.params._idBuilding }, async function(err, person) {

            for (let i = 0; i < person.room.length; i++) {
                if (person.room[i]._id == req.params.id) {
                    console.log(person.room[i]);
                    res.render('page/editRoom', { result: person.room[i], _idBuilding: req.params._idBuilding });
                    break;
                }
            }
        });
    },

    editRoom: async function(req, res) {
        Building.findOne({ _id: req.body._idBuilding }, async function(err, person) {
            console.log(req.body._idRoom);
            
            
            for (let i = 0; i < person.room.length; i++) {
                if (person.room[i]._id == req.body._idRoom) {

                    person.room[i].row = req.body.row
                    person.room[i].column = req.body.col
                    person.room[i].capacity = req.body.row * req.body.col

                    person.save((err, data) => {
                        // console.log(data);
                        res.redirect('/building/view/' + person._id)
                    })
                    break;
                }
            }
        });
    },

    deleteRoom: async function(req, res) {
        Building.findOne({ _id: req.params._idBuilding }, await
            function(err, person) {
                person.room.pull({ _id: req.params.id })
                person.save(() => {
                    res.redirect('/building/view/' + person._id)
                })
            });
    }


}