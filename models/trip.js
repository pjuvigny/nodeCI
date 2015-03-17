var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = require('./location.js');

var Trip = new Schema({

    from: { type : Schema.ObjectId, ref : 'Location' },
    to: { type : Schema.ObjectId, ref : 'Location' },
    stops: [{ type : Schema.ObjectId, ref : 'Location' }],
    startDate: {
        type: Date,
        default: Date.now
    },
    cargoType: {
        type: String,
        enum: ["Solide", "Liquide", "Explosif", "Inflammable", "Alimentaire", "Refrigere"],
        default: "Solide"
    },
    cargoSize: Number,
    cargoSizeUnit: {
        type: String,
        enum: ["L", "T", "m2", "pc"],
        default: "T"
    }
});


module.exports = mongoose.model('Trip', Trip);