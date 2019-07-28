const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yearSchema = new Schema({
    year: {
        type: String,
    },
    term: {
        type: String,
    },
    type:{
        type:String,
    }
    
});

const Year = mongoose.model('year', yearSchema,'year');

module.exports = Year;

