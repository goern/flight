/*
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AircraftSchema = new Schema({
    AircraftIdentification: String,
    AircraftTypeDesignator: String
});

AircraftSchema.statics.findByAircraftIdentification = function(AircraftIdentification, cb) {
  return this.find({ AircraftIdentification: new RegExp(AircraftIdentification, 'i') }, cb);
};

AircraftSchema.statics.findByAircraftTypeDesignator = function(AircraftTypeDesignator, cb) {
  return this.find({ AircraftTypeDesignator: new RegExp(AircraftTypeDesignator, 'i') }, cb);
};

AircraftSchema.index({ AircraftIdentification: 1, type: -1 }); // schema level
AircraftSchema.index({ AircraftTypeDesignator: 1, type: -1 }); // schema level

module.exports = mongoose.model('Aircraft', AircraftSchema);
