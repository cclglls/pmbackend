var mongoose = require('mongoose');

var progressSchema = mongoose.Schema({
  dtstat: Date,
  tasks_created: Number,
  tasks_closed: Number
});

progressModel = mongoose.model('progress', progressSchema);

module.exports = { progressModel, progressSchema };
