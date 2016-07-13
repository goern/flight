/*
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// see https://www.ivao.aero/training/documentation/books/SPP_ADC_Flightplan_Understanding.pdf
// for a details explanation
var FlightPlanSchema = new Schema({
    DateOfFlight: { type: String, required: true },             // YYMMDD
//    Message: "<=(FPL",
    AircraftIdentification: { type: String, uppercase: true, required: true }, // Field 7, a/c callsign, not flightnumber
                                                                // NO Field 8, its always VFR
                                                                // NO Field 8B, its always G
                                                                // NO Field 9, its always 1
                                                                // NO Field 9B, its always ZZZZ with no remarks
                                                                // NO Field 9C, M
                                                                // NO Field 10A, S (VHF, VOR, ILS)
                                                                // NO Field 10B, S (A/C ID, pressure altitude)
    DepartureAerodrome: { type: String, uppercase: true, required: true },
    DepartureTime: { type: String, uppercase: true, required: true }, // DepartureAerodrome local time, local timezone
    CruisingSpeed: { type: Number, required: true },            // kts
    CruisingSpeedUnit: { type: String, default: "kts", required: true },
    CruisingLevel: {type: Number, required: true },             // ft
    CruisingLevelUnit: { type: String, default: "ft" },
    Route: { type: String, default: "" },
    ArrivalAerodrome: { type: String, uppercase: true, required: true },
    EstimatedEnrouteTime: Number,                               // hours
                                                                // NO Field 16C
    OtherInformation: { type: String, default: "" },
    Endurance: { type: Number, default: 0 },
    PersonsOnBoard: { type: Number, min: 1, default: 1 },
    PilotInCommand: { type: String, default: "" }
});

FlightPlanSchema.statics.findByAircraftIdentification = function(AircraftIdentification, cb) {
  return this.find({ AircraftIdentification: new RegExp(AircraftIdentification, 'i') }, cb);
};

FlightPlanSchema.index({ AircraftIdentification: 1, type: -1 }); // schema level

module.exports = mongoose.model('FlightPlan', FlightPlanSchema);
