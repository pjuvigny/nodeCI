var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Fruit = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    yumminess: {
        type: Number,
        required: true,
        min: 0,
        max:10
    }
});

module.exports = mongoose.model('Fruit', Fruit);