// White app for node REST API

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var winston = require('winston');
var app = express();

// HATEOAS linking.
hal = require('hal');

app.use(methodOverride());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Launch with 'NODE_ENV=[production/development/etc ...] node .'
// config is reachable in all the application
config = require('./conf/config.json')[process.env.NODE_ENV || 'production'];


// Logger using console only for error
logger = new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
            level: 'error',
            json: false
        }),
      new(winston.transports.File)({
            filename: 'application.log',
            level: config.LOG_LEVEL,
            json: false
        })
    ]
});

logger.info(config.LAUNCH_MESSAGE);

// Add all the routes from routes folder
routes = require('./routes')(app);

var database_url = [config.MONGO_URI || "mongodb://" + process.env.DB_PORT_27017_TCP_ADDR + ":" + process.env.DB_PORT_27017_TCP_PORT + "/"] + config.MONGO_SCHEMA;

// Mongoose
// MongoDB configuration
mongoose.connect(database_url, function (err, res) {
    if (err) {
        logger.error('error connecting to MongoDB Database. ' + err);
    } else {
        logger.info('Connected to Database: ' + database_url);
    }
});

var server = app.listen(config.APP_PORT, config.APP_HOST);
logger.info('Listening on http://' + config.APP_HOST + ':' + config.APP_PORT);


module.exports = server;