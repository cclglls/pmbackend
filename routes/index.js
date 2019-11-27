var express = require('express');
var router = express.Router();

/* Models */
var userModel = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Login. */
router.get('/home', function(req, res, next) {
  if (req.session.user) {
    req.session.user = null;
    req.session.basket = null;
  }
  res.json({ res: true, msg: 'Home' });
});

module.exports = router;
