var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
  name: String,
  description: String,
  dtdeb: Date,
  dtclosure: Date,
  duedate: Date,
  idassignee: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  idproject: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  idsection: { type: mongoose.Schema.Types.ObjectId, ref: 'section' },
  idconversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
  follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('task', taskSchema);
