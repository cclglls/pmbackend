var mongoose = require('mongoose');

var conversationSchema = mongoose.Schema({
  name: String,
  type: String /* conversation ou status */,
  idproject: { type: mongoose.Schema.Types.ObjectId, ref: 'project' },
  idtask: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('conversation', conversationSchema);
