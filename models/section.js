var mongoose = require('mongoose');

var sectionSchema = mongoose.Schema({
  name: String,
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'workspace' },
  task: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }]
});

module.exports = mongoose.model('section', sectionSchema);
