var Schema = require('../models/trip.js');
var path = '/trip';

module.exports = function (app) {


    /**
     * Find and retrieves all results
     * @param {Object} req HTTP request object.
     * @param {Object} res HTTP response object.
     */
    findAll = function (req, res) {
        console.log("GET - " + path);
        return Schema.find(function (err, results) {
            if (!err) {
                return res.send(results);
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({
                    error: 'Server error'
                });
            }
        });
    };

    /**
     * Find and retrieves a single result by its ID
     * @param {Object} req HTTP request object.
     * @param {Object} res HTTP response object.
     */
    findById = function (req, res) {

        console.log("GET - " + path + "/:id");
        return Schema.findById(req.params.id, function (err, result) {

            if (!result) {
                res.statusCode = 404;
                return res.send({
                    error: 'Not found'
                });
            }

            if (!err) {
                
                // AUTO HATEOAS - TODO : Add right management if needed
                var resource = new hal.Resource( result.toJSON(), path + '/'+req.params.id);
                for(var name in Schema.schema.paths) {
                    var elem = Schema.schema.paths[name];
                    if (name != '_id' && elem.instance == 'ObjectID') {
                        resource.link(elem.options.ref.toLowerCase() + '_' + name, '/' + elem.options.ref.toLowerCase() +'/' + result[name]);
                    } else if (elem.caster != null && elem.caster.instance == 'ObjectID') {
                        result[name].forEach(function(subelem) {
                            resource.link(elem.caster.options.ref.toLowerCase() + '_' + name, '/' + elem.caster.options.ref.toLowerCase() +'/' + subelem);
                        });
                    }
                }
                
                return res.send(resource.toJSON());
            } else {

                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({
                    error: 'Server error'
                });
            }
        });
    };




    /**
     * Creates a new result from the data request
     * @param {Object} req HTTP request object.
     * @param {Object} res HTTP response object.
     */
    add = function (req, res) {

        console.log('POST - ' + path);

        var result = new Schema(req.body);

        result.save(function (err) {

            if (err) {

                console.log('Error while saving result: ' + err);
                res.send({
                    error: err
                });
                return;

            } else {

                console.log("Created");
                return res.send({
                    status: 'OK',
                    result: result
                });

            }

        });

    };



    /**
     * Update a result by its ID
     * @param {Object} req HTTP request object.
     * @param {Object} res HTTP response object.
     */
    update = function (req, res) {

        console.log("PUT - " + path + "/:id");
        return Schema.findById(req.params.id, function (err, result) {

            if (!result) {
                res.statusCode = 404;
                return res.send({
                    error: 'Not found'
                });
            }
            
            for(var k in req.body) result[k]=req.body[k];

            return result.save(function (err) {
                if (!err) {
                    console.log('Updated');
                    return res.send({
                        status: 'OK',
                        result: result
                    });
                } else {
                    if (err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({
                            error: 'Validation error'
                        });
                    } else {
                        res.statusCode = 500;
                        res.send({
                            error: 'Server error'
                        });
                    }
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                }

                res.send(result);

            });
        });
    };

    /**
     * Delete a result by its ID
     * @param {Object} req HTTP request object.
     * @param {Object} res HTTP response object.
     */
    del = function (req, res) {

        console.log("DELETE - " + path + "/:id");
        return Schema.findById(req.params.id, function (err, result) {
            if (!result) {
                res.statusCode = 404;
                return res.send({
                    error: 'Not found'
                });
            }

            return result.remove(function (err) {
                if (!err) {
                    console.log('Removed');
                    return res.send({
                        status: 'OK'
                    });
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({
                        error: 'Server error'
                    });
                }
            })
        });
    }

    //Link routes and actions
    app.get(path, findAll);
    app.get(path + '/:id', findById);
    app.post(path, add);
    app.put(path + '/:id', update);
    app.delete(path + '/:id', del);
}