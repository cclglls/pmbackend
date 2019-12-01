var mongoose = require('mongoose');

var progress = require('../models/progress');
var progressSchema = progress.progressSchema;

var statusSchema = mongoose.Schema({
  dtstatus: Date,
  status: String /* On track, At risk, Off track */,
  idproject: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  progress: [progressSchema],
  idconversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('status', statusSchema);
