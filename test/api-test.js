var should = require('should');
var test = require('./test-utils');

// Test suite
describe('ApiTest', function () {
    describe('Location', function () {
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

        var id = '';

        describe('POST', function () {
            it('should return 200 when posting a new location', function (done) {
                test.api.post('/location', data, [
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
            it('should retrieve the POSTed location', function (done) {
                test.api.get('/location/' + id, [
                    test.equalsToRef(data), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });

        describe('PUT/:id', function () {
            it('should modify the POSTed location', function (done) {
                test.api.put('/location/' + id, dataModified, [
                    test.equalsStatus(200), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });

        describe('GET/:id (modified)', function () {
            it('should retrieve the POSTed location modified', function (done) {
                test.api.get('/location/' + id, [
                    test.equalsToRef(dataModified), 
                    test.equalsStatus(200), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });

        describe('DELETE', function () {
            it('should return 200 when deleting the new location', function (done) {
                test.api.del('/location/' + id, [
                    test.equalsStatus(200),
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });

    });
    describe('Trip', function () {
        describe('GET', function () {
            it('should return 200 when accessing /trip', function (done) {
                test.api.get('/trip', [
                    test.equalsStatus(200), 
                    done // Calling done stops the callback chain and return.
                ]);
            })
        });
    });

});