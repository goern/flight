/*
 *
 */

var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require('morgan');
var winston = require('winston');

var FlightPlan = require('../models/flightplan');

var app = express(); // define our app using express
var server = null; // this gets set when mongo is connected

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('combined'));

// get an instance of the express Router
var router = express.Router();

router.route('/')
// create a flightplans (accessed at POST http://localhost:8080/api/flightplans)
.post(function(req, res) {
  var flightplan = new FlightPlan({
    DateOfFlight: req.body.DateOfFlight,
    AircraftIdentification: req.body.AircraftIdentification,
    DepartureAerodrome: req.body.DepartureAerodrome,
    DepartureTime: req.body.DepartureTime,
    CruisingSpeed: req.body.CruisingSpeed,
    CruisingSpeedUnit: req.body.CruisingSpeedUnit,
    CruisingLevel: req.body.CruisingLevel,
    CruisingLevelUnit: req.body.CruisingLevelUnit,
    Route: req.body.Route,
    ArrivalAerodrome: req.body.ArrivalAerodrome,
    EstimatedEnrouteTime: req.body.EstimatedEnrouteTime,
    OtherInformation: req.body.OtherInformation,
    Endurance: req.body.Endurance,
    PersonsOnBoard: req.body.PersonsOnBoard,
    PilotInCommand: req.body.PilotInCommand,
  });

  // save the flightplan and check for errors
  flightplan.save(function(err) {
    if (err) {
      res.status(400).send(err);
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

router.route('/:id')
// get the flightplans with that id (accessed at GET http://localhost:8080/api/flightplans/:id)
.get(function(req, res) {
  FlightPlan.findById(req.params.id, function(err, flightplan) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    if (flightplan != null) {
      winston.info(flightplan.id);
    }

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

module.exports = router;
