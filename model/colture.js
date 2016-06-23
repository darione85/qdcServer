// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var coltureSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    user:{ type: ObjectId, ref:'User'},
    created_at: Date,
    updated_at: Date
});


// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Coltura', coltureSchema);