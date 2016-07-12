/*
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AirlineSchema = new Schema({
  name: String, // Name of the airline
  alias: String, // Alias of the airline. For example, All Nippon Airways is commonly known as "ANA"
  iata: String, // 2-letter IATA code, if available
  icao: String, // 3-letter ICAO code, if available
  callsign: String, // Airline callsign
  country: String // Country or territory where airline is incorporated
});

AirlineSchema.statics.findByICAO = function(icao, cb) {
  return this.find({ icao: new RegExp(icao, 'i') }, cb);
};

module.exports = mongoose.model('airline', AirlineSchema);
