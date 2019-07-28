const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const staffSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    position:{
        type: String,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    }
});


const Staff = mongoose.model('staff', staffSchema);

module.exports = Staff;

