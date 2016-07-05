/*
 *
 */

var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require('morgan');
var winston = require('winston');

var FlightPlan = require('./app/models/flightplan');

var app = express(); // define our app using express
var server = null; // this gets set when mongo is connected

// configure app to use static files from ./public/
// app.use(express.static(__dirname + "/public"));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('combined'));

// get an instance of the express Router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do something
    winston.debug("This is the global logging handler...");
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/flightplans')
// create a flightplans (accessed at POST http://localhost:8080/api/flightplans)
.post(function(req, res) {
  var flightplan = new FlightPlan({
    name: req.body.name,
    description: req.body.description
  });

  // save the flightplan and check for errors
  flightplan.save(function(err) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    res.status(201).json(flightplan);
  });
}) // POST
// get all the flightplans (accessed at GET http://localhost:8080/api/flightplans)
.get(function(req, res) {
  FlightPlan.find(function(err, flightplans) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    res.json(flightplans);
  });
}); // GET

router.route('/flightplans/:id')
// get the flightplans with that id (accessed at GET http://localhost:8080/api/flightplans/:id)
.get(function(req, res) {
  FlightPlan.findById(req.params.id, function(err, flightplan) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    winston.info(flightplan.name);

    res.json(flightplan);
  });
})
// delete the flightplan with this id (accessed at DELETE http://localhost:8080/api/flightplan/:id)
.delete(function(req, res) {
  FlightPlan.remove({
    _id: req.params.id
  }, function(err, flightplan) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    res.json(flightplan);
  });
}); // DELETE

// all of our routes will be prefixed with /api
app.use('/api', router);

router.get('/_status/healthz', function(req, res) {
  // TODO chk if db != null or so
  res.json({ message: 'hooray! I am healthy!' });
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
if (mongoURL == null) mongoURL = 'mongodb://flight:flight@localhost/flight';

// connect to our database
// TODO user, pass, database need to be read from the ENV
mongoose.connect(mongoURL);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  winston.info("Database connection ready");

  server = app.listen(8080);
  winston.info("Application is running on 8080");
});
