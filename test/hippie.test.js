var hippie = require('hippie');
var app = require('../app');
var should = require('should');

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

        before(function (done) {
            hippie(app)
                .header("User-Agent", "hippie")
                .json()
                .post('/location')
                .send(data)
                .expectStatus(200)
                .end(function (err, res) {
                    var body = JSON.parse(res.body);
                    should.not.exist(err);
                    id = body.result._id;
                    done();
                });
        })
        after(function (done) {
            hippie(app)
                .header("User-Agent", "hippie")
                .json()
                .del('/location/' + id)
                .send(data)
                .expectStatus(200)
                .end(function (err, res) {
                    var body = JSON.parse(res.body);
                    should.not.exist(err);
                    done();
                });
        })
        beforeEach(function () {

        })
        afterEach(function () {

        })

        describe('GET/:id', function () {
            it('should retrieve the POSTed location', function (done) {
                hippie(app)
                    .header("User-Agent", "hippie")
                    .json()
                    .get('/location/' + id)
                    .expectStatus(200)
                    .end(function (err, res) {
                        var body = JSON.parse(res.body);
                        should.not.exist(err);
                        body.name.should.equal(data.name);
                        body.longitude.should.equal(data.longitude);
                        body.latitude.should.equal(data.latitude);
                        done();
                    });
            })
        });
        describe('PUT/:id', function () {
            it('should retrieve the POSTed location', function (done) {
                hippie(app)
                    .header("User-Agent", "hippie")
                    .json()
                    .put('/location/' + id)
                    .send(dataModified)
                    .expectStatus(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            })
        });
        describe('GET/:id', function () {
            it('should retrieve the POSTed location', function (done) {
                hippie(app)
                    .header("User-Agent", "hippie")
                    .json()
                    .get('/location/' + id)
                    .expectStatus(200)
                    .end(function (err, res) {
                        var body = JSON.parse(res.body);
                        should.not.exist(err);
                        body.name.should.equal(dataModified.name);
                        body.longitude.should.equal(dataModified.longitude);
                        body.latitude.should.equal(dataModified.latitude);
                        done();
                    });
            })
        });
    });
});