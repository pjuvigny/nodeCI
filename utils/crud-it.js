var Crud = function (resource, schema) {

    var path = '/' + resource;
    var schema = require('../models/' + resource);

    return {
        findAll: function (req, res) {
            logger.info("GET - " + path);
            return schema.find(function (err, results) {
                if (!err) {
                    return res.send(results);
                } else {
                    res.statusCode = 500;
                    logger.error('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({
                        error: 'Server error'
                    });
                }
            });
        },
        findById: function (req, res) {

            logger.info("GET - " + path + "/:id" + req.params.id);
            return schema.findById(req.params.id, function (err, result) {

                if (!result) {
                    res.statusCode = 404;
                    return res.send({
                        error: 'Not found'
                    });
                }

                if (!err) {
                    // AUTO HATEOAS - TODO : Add right management if needed
                    var resource = new hal.Resource(result.toJSON(), path + '/' + req.params.id);
                    for (var name in schema.schema.paths) {
                        var elem = schema.schema.paths[name];
                        if (name != '_id' && elem.instance == 'ObjectID') {
                            resource.link(elem.options.ref.toLowerCase() + '_' + name, '/' + elem.options.ref.toLowerCase() + '/' + result[name]);
                        } else if (elem.caster != null && elem.caster.instance == 'ObjectID') {
                            result[name].forEach(function (subelem) {
                                resource.link(elem.caster.options.ref.toLowerCase() + '_' + name, '/' + elem.caster.options.ref.toLowerCase() + '/' + subelem);
                            });
                        }
                    }

                    return res.send(resource.toJSON());
                } else {

                    res.statusCode = 500;
                    logger.error('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({
                        error: 'Server error'
                    });
                }
            });
        },
        add: function (req, res) {

            logger.info('POST - ' + path);

            var result = new schema(req.body);

            result.save(function (err) {

                if (err) {

                    logger.error('Error while saving result: ' + err);
                    if (err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({
                            error: err
                        });
                    } else {
                        res.statusCode = 500;
                        res.send({
                            error: 'Server error'
                        });
                    }
                    return;

                } else {
                    return res.send({
                        status: 'OK',
                        result: result
                    });

                }

            });

        },
        update: function (req, res) {

            logger.info("PUT - " + path + "/:id" + req.params.id);
            return schema.findById(req.params.id, function (err, result) {

                if (!result) {
                    res.statusCode = 404;
                    return res.send({
                        error: 'Not found'
                    });
                }

                for (var k in req.body) result[k] = req.body[k];

                return result.save(function (err) {
                    if (!err) {
                        return res.send({
                            status: 'OK',
                            result: result
                        });
                    } else {
                        if (err.name == 'ValidationError') {
                            res.statusCode = 400;
                            res.send({
                                error: err
                            });
                        } else {
                            res.statusCode = 500;
                            res.send({
                                error: 'Server error'
                            });
                        }
                        logger.error('Internal error(%d): %s', res.statusCode, err.message);
                    }
                });
            });
        },
        del: function (req, res) {

            logger.info("DELETE - " + path + "/:id" + req.params.id);
            return schema.findById(req.params.id, function (err, result) {
                if (!result) {
                    res.statusCode = 404;
                    return res.send({
                        error: 'Not found'
                    });
                }

                return result.remove(function (err) {
                    if (!err) {
                        return res.send({
                            status: 'OK'
                        });
                    } else {
                        res.statusCode = 500;
                        logger.error('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({
                            error: 'Server error'
                        });
                    }
                })
            });
        },
        generate: function (app) {
            app.get(path, this.findAll);
            app.get(path + '/:id', this.findById);
            app.post(path, this.add);
            app.put(path + '/:id', this.update);
            app.delete(path + '/:id', this.del);

            // Add routes to the route_list
            route_list[resource + '_url'] = path + '{/' + resource + '_id}';
        }
    }
}

module.exports = Crud;