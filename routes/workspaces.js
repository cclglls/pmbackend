var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var workspaceModel = require('../models/workspace');
var sectionModel = require('../models/section');
var projectModel = require('../models/project');
var userModel = require('../models/user');
var eventModel = require('../models/event');
var taskModel = require('../models/task');
var commentModel = require('../models/comment');
var conversations = require('./conversations');
var conversationModel = conversations.conversationModel;

/* GET workspace */
router.get('/:projectId/:userId', async function(req, res, next) {
  console.log('**** Get workspace ****');

  //console.log('req.params', req.params);

  var workspace;
  var projectId;
  var userId;

  if (req.params.projectId !== '0') {
    var projectId = new mongoose.Types.ObjectId(req.params.projectId);
    workspace = await workspaceModel.findOne({ idproject: projectId });
  }

  if (req.params.userId !== '0') {
    var userId = new mongoose.Types.ObjectId(req.params.userId);
    workspace = await workspaceModel.findOne({ iduser: userId });
  }

  var section = await sectionModel
    .find({ idworkspace: workspace._id })
    .populate([
      {
        path: 'task',
        model: taskModel,
        populate: [
          { path: 'idassignee', model: userModel },
          { path: 'idproject', model: projectModel },
          {
            path: 'idconversation',
            model: conversationModel,
            populate: { path: 'comment', model: commentModel }
          },
          {
            path: 'event',
            model: eventModel,
            populate: { path: 'user', model: userModel }
          }
        ]
      }
    ]);

  res.json({ res: true, section });
});

/* PUT workspace */
router.put('/sections', async function(req, res, next) {
  console.log('**** Put workspace sections ****');

  var sections = req.body.sections;

  //console.log(sections);

  for (var i = 0; i < sections.length; i++) {
    var sectionId = new mongoose.Types.ObjectId(sections[i]._id);
    //console.log('sectionId', sectionId);
    var task = sections[i].task.map(function(task) {
      return new mongoose.Types.ObjectId(task._id);
    });
    //console.log('task', task);

    var section = await sectionModel.findById({ _id: sectionId });
    section.task = task;
    var sectionSaveToDB = await section.save();

    console.log('section', sectionSaveToDB);
  }

  res.json({ res: true });
});

module.exports = router;
