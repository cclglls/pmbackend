var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var conversationModel = require('../models/conversation');
var commentModel = require('../models/comment');
var eventModel = require('../models/event');
var projectModel = require('../models/project');

var createevent = require('./createevent');

/* GET conversations */
router.get('/', async function(req, res, next) {
  console.log('**** Get conversations ****');

  var conversation = await conversationModel.find().populate([
    {
      path: 'comment',
      model: commentModel,
      populate: { path: 'event', model: eventModel }
    },
    { path: 'event', model: eventModel }
  ]);
  res.json({ res: true, conversation });
});

/* Post conversation creation */
var createconversation = async function(req) {
  console.log(req.body.name);

  var name = req.body.name;
  var idproject = req.body.idproject;
  var idtask = req.body.idtask;
  var type = req.body.type;
  var comment = req.body.comment;
  var iduser = req.body.iduser;

  /* Save the conversation */
  var newconversation = new conversationModel({
    name,
    idproject,
    idtask,
    type
  });

  /* Create event 'C' */
  var eventSaveToDB = await createevent(newconversation._id, 'CV', 'C', iduser);

  newconversation.event.push(eventSaveToDB._id);

  var conversationSaveToDB = await newconversation.save();

  /* Maj comment on conversation */
  var conversation = conversationSaveToDB;
  if (comment) {
    var body = {
      comment: [{ _id: '0', comment }]
    };
    var reqconv = { body };
    conversation = await updateconversation(conversationSaveToDB._id, reqconv);
  }

  /* Add conversation to project if necessary */
  if (idproject) {
    var project = await projectModel.findById(idproject);
    project.conversation.push(conversationSaveToDB._id);
    var projectSaveToDB = await project.save();
  }

  return { res: true, conversation: conversation };
};

router.post('/conversation', async function(req, res, next) {
  console.log('**** Post conversation creation ****');

  var result = await createconversation(req);

  res.json(result);
});

var updatecomment = async function(commentId, comment) {
  console.log(commentId, comment);

  var commentSaveToDB;
  if (commentId === '0') {
    /* New comment */
    var newcomment = new commentModel({
      comment
    });

    /* Create event creation */
    var eventSaveToDB = await createevent(newcomment._id, 'CT', 'U');
    newcomment.event.push(eventSaveToDB._id);

    /* Save comment */
    commentSaveToDB = await newcomment.save();
    commentId = commentSaveToDB._id;
  } else {
    /* Maj comment */
    var Id = new mongoose.Types.ObjectId(commentId);
    var commentFound = await commentModel.findById(Id);
    commentFound.comment = comment;
    /* Create event update */

    var eventSaveToDB = await createevent(commentFound._id, 'CT', 'U');
    commentFound.event.push(eventSaveToDB._id);

    /* Save comment */
    commentSaveToDB = await commentFound.save();
  }
  return commentId;
};

/* Put conversation creation */
var updateconversation = async function(conversationId, req) {
  var name = req.body.name;
  var comment = req.body.comment;

  var conversation = await conversationModel.findById(conversationId);

  if (conversation) {
    if ((name && name !== conversation.name) || comment) {
      /* Maj à jour */
    } else {
      /* ne rien toucher */
      return { res: true, conversation };
    }

    if (name) conversation.name = name;

    if (comment) {
      var idcomment;
      var commentUpdated;
      for (var i = 0; i < comment.length; i++) {
        console.log('commentaire', i, comment[i]);
        idcomment = comment[i]._id;
        commentUpdated = await updatecomment(idcomment, comment[i].comment);
        if (idcomment === '0') {
          conversation.comment.push(commentUpdated._id);
        }
      }
    }

    /* create update event */
    var eventSaveToDB = await createevent(conversation._id, 'CV', 'U');

    conversation.event.push(eventSaveToDB._id);

    /* Save the conversation */
    var conversationSaveToDB = await conversation.save();

    return { res: true, conversation: conversationSaveToDB };
  } else {
    return { res: false, msg: 'Conversation not found !' };
  }
};

router.put('/conversation/:conversationId', async function(req, res, next) {
  console.log('**** Put conversation update ****');

  var result = await updateconversation(req.params.conversationId, req);

  res.json(result);
});

module.exports = {
  router,
  createconversation,
  updateconversation,
  updatecomment
};
