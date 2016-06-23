/**
 * Created by dario on 23/06/16.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var trattamentoProdottiSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    prodotto:{ type: ObjectId, ref:'prodottiSchema'},
    user:{ type: ObjectId, ref:'userSchema'},
    quantita: Number,
    trattamento: { type: ObjectId, ref:'trattamentiSchema'},
    duration: Number,
    date: Date,
    unita: { type: ObjectId, ref:'unitaSchema'},
    created_at: Date,
    updated_at: Date
});



// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('TrattamentoProdotti', trattamentoProdottiSchema);