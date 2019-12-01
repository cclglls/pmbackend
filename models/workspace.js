var mongoose = require('mongoose');

var workspaceSchema = mongoose.Schema({
  iduser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  idproject: { type: mongoose.Schema.Types.ObjectId, ref: 'project' }
});

module.exports = mongoose.model('workspace', workspaceSchema);
