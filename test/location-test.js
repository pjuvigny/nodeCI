var should = require('should');
var test = require('./test-utils');

// Modify the tested resource
var resource = 'location';

var data = {
    name: 'Montpellier, France',
    longitude: 2.352222,
    latitude: 48.856614
};

var dataModified = {
    name: 'Nowhere, France',
    longitude: 2,
    latitude: 48
};

// Object failing validation
var validationPutErrors = [];

// Object failing validation
var validationPostErrors = [];

// Test suite
describe('ApiTest', function () {
    describe(resource, function () {
        
        var id = '';

        describe('POST', function () {
            it('should return 200 when POSTing a new ' + resource, function (done) {
                test.api.post('/'+resource, data, [
                    function (err, res, callbacks) {
                        should.not.exist(err);
                        var body = JSON.parse(res.body);
                        id = body.result._id;
                        
                        // Calls the next method in the method array (here 'done')
                        callbacks.shift()(err, res, callbacks);
                    }, done]);
            })
        });

        describe('GET/:id', function () {
            it('should retrieve the POSTed ' + resource, function (done) {
                test.api.get('/' + resource + '/' + id, [
                    test.equalsToRef(data), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });

        describe('PUT/:id', function () {
            it('should modify the POSTed ' + resource, function (done) {
                test.api.put('/' + resource + '/' + id, dataModified, [
                    test.equalsStatus(200), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });
        
        describe('GET/:id (modified)', function () {
            it('should retrieve the POSTed ' + resource + ' modified', function (done) {
                test.api.get('/' + resource + '/' + id, [
                    test.equalsToRef(dataModified), 
                    test.equalsStatus(200), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });
        
        describe('PUT/:id (Validation errors)', function () {
            var cpt=0;
            validationPutErrors.forEach(function (e) {
                it('should return a validation error when PUTing wrong ' + resource + ' ('+ ++cpt +')', function (done) {
                    test.api.put('/' + resource + '/' + id, e.data, [
                        test.equalsStatus(400),
                        test.isValidationError(e.errors),
                        done // Calling done stops the callback chain and return.
                    ]);
                })
            })
        });

        describe('DELETE', function () {
            it('should return 200 when DELETEing the new ' + resource, function (done) {
                test.api.del('/' + resource + '/' + id, [
                    test.equalsStatus(200),
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });
        
        describe('POST (Validation errors)', function () {
            var cpt=0;
            validationPostErrors.forEach(function (e) {
                it('should return a validation error when POSTing wrong ' + resource + ' ('+ ++cpt +')', function (done) {
                    test.api.post('/' + resource, e.data,[
                        test.equalsStatus(400),
                        test.isValidationError(e.errors),
                        done // Calling done stops the callback chain and return.
                    ]);
                })
            })
        });

    });
});