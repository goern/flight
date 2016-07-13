/*
 *
 */

var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require('morgan');
var winston = require('winston');
var request = require('request');

var Aircraft = require('../models/aircraft');

var app = express(); // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ "extended": true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('combined'));

// get an instance of the express Router
var router = express.Router();

router.route('/')
.post(function(req, res) {
  var ac = new Aircraft({
    AircraftIdentification: req.body.AircraftIdentification,
    AircraftTypeDesignator: req.body.AircraftTypeDesignator
  });
  ac.save(function(err) {
    if (err) { // TODO what if entity already exists?
      res.status(400).send(err); // FIXME should be 404 (Not Found), 409 (Conflict)
      return winston.error(err);
    }

    res.status(201).json(ac);
  });
}) // POST
.get(function(req, res) {
  Aircraft.find(function(err, ap) {
    if (err) {
      res.status(404).send(err);
      return winston.error(err);
    }

    res.status(200).json(ap);
  });
}); // GET

router.route('/:id')
.get(function(req, res) {
  Aircraft.findById(req.params.id, function(err, ac) {
    if (err) {
      res.status(404).send(err);
      return winston.error(err);
    }

    res.status(200).json(ac);
  });
}) // GET
.patch(function(req, res) {
  res.status(501).json(null); // TODO
})
.put(function(req, res) {
  res.status(501).json(null); // TODO
})
.delete(function(req, res) {
  Aircraft.remove({
    _id: req.params.id
  }, function(err, ac) {
    if (err) { // FIXME what if we cant delete due to reference vialation?
      res.status(404).send(err);
      return winston.error(err);
    }

    res.status(200).json(ac);
  });
}); // DELETE

module.exports = router;
