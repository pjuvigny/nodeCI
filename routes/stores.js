var Crudit = require('../utils/crud-it');
// Modify the resource to point on your schema
var resource = 'stores';

var schema = require('../models/' + resource);

var owners = require('../models/owners');

var crud = Crudit(resource, schema);

module.exports = function (app) {
    crud.generate(app);
    

    getOwner = function (req, res) {

        logger.info("GET - " + resource + "/" + req.params.id + "/owner");
        return schema.findById(req.params.id, function (err, store) {
            if (!err) {
                owners.find({
                    '_id': store.owner
                }, function (err, owner) {
                    if (!err) {
                        return res.send(owner);
                    } else {
                        res.statusCode = 500;
                        logger.error('Internal error(%d): %s', res.statusCode, err.message);
                        return res.send({
                            error: 'Server error'
                        });
                    }
                });
            } else {
                res.statusCode = 500;
                logger.error('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({
                    error: 'Server error'
                });
            }
        });
    }
    
    
    app.get('/' + resource + '/:id/owner', getOwner);
    
}
