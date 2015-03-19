var hippie = require('hippie');
var app = require('../app');
var should = require('should');

var apiTest = {
    general: function (method, path, data, cb) {
        hippie(app)
            .header("User-Agent", "hippie")
            .json()[method](path)
            .send(data || {})
            .end(cb);
    },
    get: function (path, cb) {
        apiTest.general('get', path, null, cb)
    },
    post: function (path, data, cb) {
        apiTest.general('post', path, data, cb)
    },
    put: function (path, data, cb) {
        apiTest.general('put', path, data, cb)
    },
    del: function (path, cb) {
        apiTest.general('del', path, null, cb)
    }
}

var equalsToRef = function (ref, cb) {
    return function (err, res) {
        should.not.exist(err);
        var body = JSON.parse(res.body);
        for (var field in ref) {
            ref[field].should.equal(body[field]);
        }
        cb(err, res);
    }
}

var equalsStatus = function (status, cb) {
    return function (err, res) {
        should.not.exist(err);
        res.statusCode.should.equal(status);
        cb(err, res);
    }
}

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
                apiTest.post('/location', data, function (err, res) {
                    should.not.exist(err);
                    var body = JSON.parse(res.body);
                    id = body.result._id;
                    done();
                });
            })
        });

        describe('GET/:id', function () {
            it('should retrieve the POSTed location', function (done) {
                apiTest.get('/location/' + id, equalsToRef(data, done));
            })
        });

        describe('PUT/:id', function () {
            it('should modify the POSTed location', function (done) {
                apiTest.put('/location/' + id, dataModified, equalsStatus(200, done));
            })
        });

        describe('GET/:id (modified)', function () {
            it('should retrieve the POSTed location modified', function (done) {
                apiTest.get('/location/' + id, equalsToRef(dataModified, equalsStatus(200, done)));
            })
        });

        describe('DELETE', function () {
            it('should return 200 when deleting the new location', function (done) {
                apiTest.del('/location/' + id, equalsStatus(200, done));
            })
        });


    });
    describe('Trip', function () {
        describe('GET', function () {
            it('should return 200 when accessing /trip', function (done) {
                apiTest.get('/trip', equalsStatus(200, done));
            })
        });
    });

});