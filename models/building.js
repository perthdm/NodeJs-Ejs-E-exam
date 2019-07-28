const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const buildingSchema = new Schema({
    namebuilding: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    fullnamebuilding: {
        type: String,
        required: true,
        lowercase: true
    },
    room: [{
        no:{
            type: String,
            uppercase: true
        },
        capacity:{
            type: Number
        },
        row:{
            type: Number
        },
        column:{
            type: Number
        }
    }]

    
});


const Building = mongoose.model('building', buildingSchema);

module.exports = Building;

