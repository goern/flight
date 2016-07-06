/*
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// see https://www.ivao.aero/training/documentation/books/SPP_ADC_Flightplan_Understanding.pdf
// for a details explanation
var FlightPlanSchema = new Schema({
    AircraftIdentification: String, // Field 7
                                    // NO Field 8, its always VFR
                                    // NO Field 8B, its always G
                                    // NO Field 9, its always 1
                                    // NO Field 9B, its always ZZZZ with no remarks
                                    // NO Field 9C, M
                                    // NO Field 10A, S (VHF, VOR, ILS)
                                    // NO Field 10B, S (A/C ID, pressure altitude)
    DepartureAerodrome: String,
    DepartureTime: String,
    CruisingSpeed: String,
    CruisingLevel: String,
    Route: String,
    ArrivalAerodrome: String,
    EstimatedEnRouteTime: String,
                                    // NO Field 16C
    OtherInformation: String,
    Endurance: String,
    PersonsOnBoard: String,
    PilotInCommand: String,
});

FlightPlanSchema.statics.findByAircraftIdentification = function(AircraftIdentification, cb) {
  return this.find({ AircraftIdentification: new RegExp(AircraftIdentification, 'i') }, cb);
};

FlightPlanSchema.index({ AircraftIdentification: 1, type: -1 }); // schema level

module.exports = mongoose.model('FlightPlan', FlightPlanSchema);
