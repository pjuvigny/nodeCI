var hippie = require('hippie');
var app = require('../app');
var should = require('should');

module.exports = {

    api: {
        general: function (method, path, data, callbacks) {
            hippie(app)
                .header("User-Agent", "hippie")
                .json()[method](path)
                .send(data || {})
                .end(function (err, res) {
                    callbacks.shift()(err, res, callbacks);
                });
        },
        get: function (path, callbacks) {
            this.general('get', path, null, callbacks)
        },
        post: function (path, data, callbacks) {
            this.general('post', path, data, callbacks)
        },
        put: function (path, data, callbacks) {
            this.general('put', path, data, callbacks)
        },
        del: function (path, callbacks) {
            this.general('del', path, null, callbacks)
        }
    },

    // Callback testing the JSON result compared to the ref object
    equalsToRef: function (ref) {
        return function (err, res, callbacks) {
            should.not.exist(err);
            var body = JSON.parse(res.body);
            for (var field in ref) {
                ref[field].should.equal(body[field]);
            }

            // Go on with the next callbacks
            callbacks.shift()(err, res, callbacks);
        }
    },

    // Callback testing the statusCode
    equalsStatus: function (status) {
        return function (err, res, callbacks) {
            should.not.exist(err);
            res.statusCode.should.equal(status);
            
            // Go on with the next callbacks
            callbacks.shift()(err, res, callbacks);
        }
    },
    
    // Callback for testing validation error
    isValidationError: function (errors) {
        return function (err, res, callbacks) {
            should.not.exist(err);
            JSON.parse(res.body).error.name.should.equal('ValidationError');
            
            errors.forEach(function(e) {
                JSON.parse(res.body).error.errors.should.have.property(e);
            });
            
            // Go on with the next callbacks
            callbacks.shift()(err, res, callbacks);
        }
    }

}