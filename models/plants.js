var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fruits = require('./fruits.js');

var Plants = new Schema({
    name: {
        type: String,
        required: true
    },
    fruit: {
        type: Schema.ObjectId,
        ref: 'Fruits',
        required: true
    },
    size: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: true
    }
});

module.exports = mongoose.model('Plants', Plants);