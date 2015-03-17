var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = new Schema({
    name: String,
    longitude: Number,
    latitude: Number
});

module.exports = mongoose.model('Location', Location);