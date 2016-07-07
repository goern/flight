/*
 *
 */

var express = require("express");
var bodyParser = require("body-parser");
var morgan = require('morgan');
var winston = require('winston');

var app = express(); // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('combined'));

// get an instance of the express Router
var router = express.Router();

router.route('/')
.get(function(req, res) {
  res.status(501).json({message: "no API here"})
}); // GET

router.route('/:icao')
.get(function(req, res) {
  types = require('../../List_of_ICAO_aircraft_type_designators');

  winston.debug("looking for aircraft type designator (ICAO)", req.params.icao);

  for (var ac in types) {
    if (types[ac]["ICAO"] == req.params.icao) {
      winston.info("A/C (ICAO)", types[ac]);
      return res.json(types[ac]);
    }
  }

  res.json(null);
}); // GET

module.exports = router;
