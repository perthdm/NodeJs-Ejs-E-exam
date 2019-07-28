//Year Controller
const Year = require('../models/year');

module.exports = {
    index: async function (req, res) {
        Year.find().sort({ year: -1 }).exec(function (err, result) {
            if (err) { console.log(err) }
            res.render('page/year', { result: result });
        });
    },

    addYear: async function (req, res) {
        // console.log(req.body.type);


        const newYear = new Year({
            year: req.body.year,
            term: req.body.term,
            type: req.body.type

        });


        Year.findOne({ year: req.body.year, term: req.body.term }).exec(async function (err, person) {
            if (person) {
                console.log('use already');
                res.redirect('/year');
            } else {
                if (req.body.type == 'on') {
                    await Year.update({}, { $set: { type: 'off' } }, { multi: true, new: true });
                    newYear.save((err, result) => {
                        if (err) { console.log(err) }
                        console.log(result);
                        res.redirect('/year');
                    });
                }else{
                    newYear.type = 'off';
                    newYear.save((err, result) => {
                        if (err) { console.log(err) }
                        console.log(result);
                        res.redirect('/year');
                    });
                }
            }
        });




    },
    check: async function (req, res) {
        await Year.update({}, { $set: { type: 'off' } }, { multi: true, new: true });
        Year.findOne({ _id: req.params._id }, function (err, person) {
            person.type = 'on';
            person.save(() => {
                res.redirect('/year');
            })
        });
    },

    del: async function (req,res){
        Year.findOne({_id : req.params._id},await function (err,person){
            person.remove(()=>{
                res.redirect('/year');
            });      
        });
    }

}




