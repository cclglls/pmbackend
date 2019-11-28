var mongoose = require('mongoose');

var workspaceSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'project' }
});

module.exports = mongoose.model('workspace', workspaceSchema);
