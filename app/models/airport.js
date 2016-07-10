/*
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AirportSchema = new Schema({
  name: String,
  city: String,
  country: String,
  iata: String,
  icao: String,
  lat: String,
  lon: String,
  alt: String,
  utc_offset: String,
  dst: String,
  tz: String
});

AirportSchema.statics.findByICAO = function(icao, cb) {
  return this.find({ icao: new RegExp(icao, 'i') }, cb);
};

module.exports = mongoose.model('airport', AirportSchema);
