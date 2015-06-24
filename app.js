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
// Config is reachable in all the application taken from ./conf/config.json
config = require('./conf/config.json')[process.env.NODE_ENV || 'production'];


// Logger using console only for errors
logger = new(winston.Logger)({
    transports: [
      /*new(winston.transports.Console)({
            level: 'error',
            json: false
        }),*/
      new(winston.transports.File)({
            filename: 'application.log',
            level: config.LOG_LEVEL,
            json: false
        })
    ]
});

// Prints Launch message
logger.info(config.LAUNCH_MESSAGE);

// API object to be sent back on "GET /"
route_list = {};

// Add all the routes from the ./routes folder
routes = require('./routes')(app);

// Answers to "GET /", Add all the routes you need in the corresponding ./routes file with route_list[resource] = path;
app.get("/", function (req, res) {res.send(route_list);});


// Mongoose
// MongoDB configuration
var database_url = [config.MONGO_URI || "mongodb://" + process.env.DB_PORT_27017_TCP_ADDR + ":" + process.env.DB_PORT_27017_TCP_PORT + "/"] + config.MONGO_SCHEMA;
mongoose.connect(database_url, function (err, res) {
    if (err) {
        logger.error('Error connecting to MongoDB Database. ' + err);
    } else {
        logger.info('Connected to Database: ' + database_url);
    }
});

var server = app.listen(config.APP_PORT, config.APP_HOST);
logger.info('Listening on http://' + config.APP_HOST + ':' + config.APP_PORT);


module.exports = server;