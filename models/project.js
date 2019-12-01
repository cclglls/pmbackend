var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
  name: String,
  description: String,
  dtdeb: Date,
  duedate: Date,
  idowner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  conversation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'conversation' }],
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('project', projectSchema);
