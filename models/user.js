const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    id: Schema.ObjectId,
    type:{
        type:String,
        required: true
    }
    
});

userSchema.methods.isValidPassword = async function(PasswordLogin) {
	try{
		return await bcrypt.compare(PasswordLogin,this.password);
	} catch(error) {
		throw new Error(error);
	}
}


const User = mongoose.model('user', userSchema);

module.exports = User;

