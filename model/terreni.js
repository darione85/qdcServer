/**
 * Created by dario on 23/06/16.
 */

// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var terreniSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    user:{ type: ObjectId, ref:'userSchema'},
    created_at: Date,
    updated_at: Date
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Terreno', terreniSchema);