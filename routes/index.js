var fs = require('fs');

module.exports = function (app) {
    fs.readdirSync(__dirname).forEach(function (file) {
        // Fix bug on CentOS - YCI
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js') {
            return;
        }
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(app);
    });
}