var express = require('express');
var router = express.Router();

var uid2 = require('uid2');
var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');

var userModel = require('../models/user');

var createevent = require('./createevent');
var createworkspace = require('./createworkspace');
var updatesection = require('./updatesection');

router.get('/', async function(req, res, next) {
  console.log('**** Get users ****');

  var user = await userModel.find().populate('event');

  res.json({ res: true, user: user });
});

/* Post sign-up. */
router.post('/sign-up', async function(req, res, next) {
  console.log('**** Post sign-up ****');

  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var iduser = req.body.iduser;

  var type = 'admin';
  var dtevent = new Date();
  var initials =
    firstname.charAt(0).toUpperCase() + lastname.charAt(0).toUpperCase();

  var searchEmail = await userModel.findOne({ email });

  if (!searchEmail) {
    /* Save the user */
    var salt = uid2(32);
    var newUser = new userModel({
      firstname,
      lastname,
      initials,
      email,
      salt: salt,
      password: SHA256(password + salt).toString(encBase64),
      token: uid2(32),
      type
    });

    var eventSaveToDB = await createevent(newUser._id, 'U', 'C', iduser);

    newUser.event.push(eventSaveToDB._id);

    var userSaveToDB = await newUser.save();

    var workspaceSaveToDB = await createworkspace(userSaveToDB._id, null);

    var section = await updatesection(workspaceSaveToDB, null, null);

    res.json({ res: true, user: userSaveToDB });

    /* Memorize the user for the session */
    req.session.user = userSaveToDB;
  } else {
    res.json({
      res: false,
      msg: 'Sign-up refused: this email is already used by another user'
    });
  }
});

/* GET Sign in */
router.get('/sign-in', async function(req, res, next) {
  var isUserExist = false;

  console.log('email from front', req.query);

  // All the user from the database with the email from the front will be stored in data
  const user = await userModel.findOne({
    email: req.query.email
  });

  var hash = SHA256(req.query.password + user.salt).toString(encBase64);

  // We are checking it there is a user or not
  if (!user) {
    isUserExist = false;
  } else {
    if (hash === user.password) {
      isUserExist = true;
    } else {
      isUserExist = false;
    }
  }

  res.json({ res: true, isUserExist, user });
});

/* GET Logout. */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.json({ res: true, msg: 'Logout' });
});

module.exports = router;
