/*
 *
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FlightPlanSchema = new Schema({
    name: String,
    description: String
});

FlightPlanSchema.statics.findByName = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
};

FlightPlanSchema.index({ name: 1, type: -1 }); // schema level

module.exports = mongoose.model('FlightPlan', FlightPlanSchema);
