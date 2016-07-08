/*
 *
 */

var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require('morgan');
var winston = require('winston');

var Airport = require('../models/airport');

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
.get(function(req, res) {
  Airport.find(function(err, ap) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    res.json(ap);
  });
}); // GET

router.route('/:id')
.get(function(req, res) {
  Airport.findById(req.params.id, function(err, ap) {
    if (err) {
      res.send(err);
      return winston.error(err);
    }

    if (ap != null) {
      winston.info(ap.id);
    }

    res.json(ap);
  });
}); // GET

module.exports = router;
