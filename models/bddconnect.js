const mongoose = require('mongoose');

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

var url =
  'mongodb+srv://cclglls:L@C@psule@cluster0-lvrv3.mongodb.net/projectmngt?retryWrites=true&w=majority';

mongoose.connect(url, options, function(err) {
  if (err) {
    console.log(`error, failed to connect to the database because --> ${err}`);
  } else {
    console.info('ProjectMngt cclglls Database connection : Success ***');
  }
});

module.exports = mongoose;
