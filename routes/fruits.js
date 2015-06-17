var Crudit = require('../utils/crud-it');
// Modify the resource to point on your schema
var resource = 'fruits';

var schema = require('../models/' + resource);

var crud = Crudit(resource, schema);

module.exports = function (app) {
    crud.generate(app);
}
