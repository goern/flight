/*
 *
 */

var mongoose = require('mongoose');
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require('morgan');
var winston = require('winston');
var request = require('request');

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

router.route('/:iac')
.get(function(req, res) {
  // I guess this can be refactored TODO
  // lets assume its an ICAO code, if its 4 chars long...
  if (req.params.iac.length == 4) {
    Airport.findByICAO(req.params.iac, function(err, ap) {
      if (err) {
        res.send(err);
        return winston.error(err);
      }

      if (ap != null) {
        winston.info(ap.id);
      }

      res.json(ap);
    });
  } else {
    Airport.findById(req.params.iac, function(err, ap) {
      if (err) {
        res.send(err);
        return winston.error(err);
      }

      if (ap != null) {
        winston.info(ap.id);
      }

      res.json(ap);
    });
  } // if
}) // GET
.put(function(req, res) {
  if (req.params.iac == 'zooNg4Oh') {
    //Converter Class
    var Converter = require("csvtojson").Converter;
    var converter = new Converter({constructResult:false}); //for big csv data

    // record_parsed will be emitted each csv row being processed
    converter.on("record_parsed", function (jsonObj) {
      var airport = new Airport(jsonObj);

      Airport.create(jsonObj, function (err, small) {
        if (err) {
          res.json({ message: err});
          return winston.error(err);
        }
        // saved!
      })
    });

    converter.on("end_parsed",function() {
      winston.info("Airports updated!");
      res.json({message: "Airports updated!"});
    });

    var header = "id,name,city,country,iata,icao,lat,lon,alt,utc_offset,dst,tz,pad";

    converter.write(header);
    request.get('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').pipe(converter);
  }
}); // PUT

module.exports = router;
