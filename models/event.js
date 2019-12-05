var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  dtevent: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  entity: String,
  type: String,
  iduser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  idproject: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  idtask: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
  idconversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
  idcomment: { type: mongoose.Schema.Types.ObjectId, ref: 'comment' },
  idstatus: { type: mongoose.Schema.Types.ObjectId, ref: 'status' }
});

module.exports = mongoose.model('event', eventSchema);
