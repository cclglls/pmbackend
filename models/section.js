var mongoose = require('mongoose');

var sectionSchema = mongoose.Schema({
  name: String,
  idworkspace: { type: mongoose.Schema.Types.ObjectId, ref: 'workspace' },
  task: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task' }]
});

module.exports = mongoose.model('section', sectionSchema);
