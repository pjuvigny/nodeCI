var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Location = require('./location.js');

var Quotation = new Schema({

    tripId: {
        type: Schema.Types.ObjectId,
        require: true
    },
    from: { type : Schema.ObjectId, ref : 'Location' },
    to: { type : Schema.ObjectId, ref : 'Location' },
    date: {
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
    },
    proposedPrice: Number
});


module.exports = mongoose.model('Quotation', Quotation);