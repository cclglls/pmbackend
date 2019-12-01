var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
  comment: String,
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('comment', commentSchema);
