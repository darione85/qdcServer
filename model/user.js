// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email:{ type: String, required: true, unique: true },
    token : {type: String},
    admin: Boolean,
    location: String,
    application: Schema.Types.Mixed,//oggetto 
    role:Schema.Types.Mixed,//oggetto
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date
});


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);