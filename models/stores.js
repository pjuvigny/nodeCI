var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fruits = require('./fruits.js');
var Owners = require('./owners.js');

var Stores = new Schema({
    name: {
        type: String,
        required: true
    },
    fruits: [{fruit: { type : Schema.ObjectId, ref : 'Fruits' }, number: Number}],
    owner: {
        type : Schema.ObjectId,
        ref : 'Owners'
    }
});

module.exports = mongoose.model('Stores', Stores);