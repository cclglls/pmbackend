var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  initials: String,
  email: String,
  password: String,
  token: String,
  salt: String,
  type: String,
  event: [{ type: mongoose.Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('user', userSchema);
