/****************** Requiring Built in module dependencies ******************/
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/*** create a schema ***/
let userSchema = new Schema({
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_deleted:{ type: Boolean, default: false },
    created_at: { type: Date, default: getDate },
    updated_at: { type: Date, default: getDate }
});

// the schema is useless so far, we need to create a model using it
let User = mongoose.model('User', userSchema);

function getDate(){
	return new Date();
}

// make this model available in other parts of application
module.exports = User;