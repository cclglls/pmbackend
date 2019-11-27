var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  dtevent: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  entity: String,
  type: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
  conv: { type: mongoose.Schema.Types.ObjectId, ref: 'conv' },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' }
});

module.exports = mongoose.model('event', eventSchema);
