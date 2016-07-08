/*
*
*/

var winston = require('winston');
var request = require('request');
var parse = require('csv-parse');
var mongoose = require('mongoose');

var Airport = require('./app/models/airport');
var airports = [];

mongoose.connect('mongodb://flight:flight@localhost/flight');

var db = mongoose.connection;

db.on('error', function() {
  winston.error('cant connect to MongoDB');
});

db.once('open', function() {

});

//Converter Class
var Converter = require("csvtojson").Converter;
var converter = new Converter({constructResult:false}); //for big csv data

// record_parsed will be emitted each csv row being processed
converter.on("record_parsed", function (jsonObj) {
  var airport = new Airport(jsonObj);

  Airport.create(jsonObj, function (err, small) {
    if (err) {
      return winston.error(err);
    }
    // saved!
  })
/*
  airport.save(function (err) {
    if (err) {
      winston.error(err);
    }
  }); */
});

converter.on("end_parsed",function() {
  winston.info("conversion done, closing db connection...");

  mongoose.disconnect();
});

var header = "id,name,city,country,iata,icao,lat,lon,alt,utc_offset,dst,tz,pad";

converter.write(header);
request.get('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat').pipe(converter);
