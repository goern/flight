/*
 *
 */

var mongoose = require('mongoose');
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var winston = require('winston');

var app = express(); // define our app using express
var server = null; // this gets set when mongo is connected
var db = null; // this is for mongoose

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// use morgan to log requests to the console
app.use(morgan('combined'));

// get an instance of the express Router
var router = express.Router();

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// serve static files from public/ directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./app/routes/index'));

// bind routes to code
app.use('/api/flightplans', require('./app/routes/flightplans'));
app.use('/api/aircrafts/types', require('./app/routes/aircraft_types'));
app.use('/api/aircrafts', require('./app/routes/aircrafts'));
app.use('/api/airports', require('./app/routes/airports'));
app.use('/api/airlines', require('./app/routes/airlines'));

app.get('/healthz', function(req, res) {
  if (db == null) {
    return res.status(503).json({ message: 'MongoDB is not ready yet.'});
  }

  res.json({ message: 'All systems GO!' });
});

// lets find our database
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
  mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
  mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
  mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
  mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

// if we cant construct a URL set a default
if ((mongoURL == null) && !(process.env.MONGO == 'NO')) {
  winston.error("No mongoURL constructable!");
  return;
}

// connect to our database
mongoose.set('debug', true);
mongoose.connect(mongoURL, { server: { auto_reconnect:true } });

db = mongoose.connection;

db.on('error', function(error) {
  winston.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.once('open', function() {
  winston.info("Database connection ready");

  server = app.listen(port);
  winston.info("Application is running on 8080");
});

db.on('disconnected', function() {
  winston.info('MongoDB disconnected!');
  mongoose.connect(mongoURL, { server: { auto_reconnect:true } });
});

db.on('reconnected', function () {
  winston.info('MongoDB reconnected!');
});


module.exports = app;
