var express = require('express');
var router = express.Router();

var taskModel = require('../models/task');
var userModel = require('../models/user');
var projectModel = require('../models/project');
var sectionModel = require('../models/section');
var eventModel = require('../models/event');
var commentModel = require('../models/comment');
var workspaceModel = require('../models/workspace');

var createevent = require('./createevent');
var conversations = require('./conversations');
var conversationModel = conversations.conversationModel;
var createconversation = conversations.createconversation;
var updateconversation = conversations.updateconversation;

var mongoose = require('mongoose');

/* GET tasks */
router.get('/:projectId/:userId', async function(req, res, next) {
  console.log('**** Get tasks ****');

  var projectId;
  var userId;
  if (req.params.projectId !== '0')
    projectId = new mongoose.Types.ObjectId(req.params.projectId);
  if (req.params.userId !== '0')
    userId = new mongoose.Types.ObjectId(req.params.userId);

  var searchObject = {};
  if (projectId) searchObject = { idproject: projectId };
  if (userId) searchObject = { idassignee: userId };

  var task = await taskModel.find(searchObject).populate([
    { path: 'idassignee', model: userModel },
    { path: 'idproject', model: projectModel },
    /*{ path: 'idsection', model: sectionModel },*/
    {
      path: 'idconversation',
      model: conversationModel,
      populate: { path: 'comment', model: commentModel }
    },
    { path: 'event', model: eventModel }
  ]);

  res.json({ res: true, task });
});

/* Post task creation */
router.post('/task', async function(req, res, next) {
  console.log('**** Post task creation ****');

  var name = req.body.name;
  var description = req.body.description;
  var dtdeb = req.body.dtdeb;
  var duedate = req.body.duedate;
  var idassignee = req.body.idassignee;
  var idproject = req.body.idproject;
  var idsection = req.body.idsection;
  var idconversation = req.body.idconversation;
  var follower = req.body.follower;
  var iduser = req.body.iduser;

  /* Create task */
  var newtask = new taskModel({
    name,
    description,
    duedate,
    idassignee,
    idproject,
    idsection,
    idconversation,
    follower
  });

  /* Create event */
  var eventSaveToDB = await createevent(newtask._id, 'T', 'C', iduser, dtdeb);

  newtask.event.push(eventSaveToDB._id);
  newtask.dtdeb = eventSaveToDB.dtevent;

  /* Init task conv : only one */
  name = 'Conversation on task id ' + newtask._id;
  var body = {
    name,
    idtask: newtask._id,
    type: 'conversation'
  };
  var reqconv = { body };

  var result = await createconversation(reqconv);

  newtask.idconversation = result.conversation._id;

  /* Save the task */
  var taskSaveToDB = await newtask.save();

  /* Ajout tache dans le workspace project */
  var section;
  if (!idsection) section = await sectionModel.findOne({ name: 'Backlog' });
  else section = await sectionModel.findById(idsection);

  section.task.push(taskSaveToDB._id);
  var sectionSaveToDB = await section.save();

  /* Ajout tache dans le workspace user */
  var workspace = await workspaceModel.findOne({
    iduser: idassignee
  });

  console.log(workspace);

  section = await sectionModel.findOne({
    idworkspace: workspace._id,
    name: 'Tasks assigned to me'
  });
  console.log(section, taskSaveToDB._id);
  section.task.push(taskSaveToDB._id);
  sectionSaveToDB = await section.save();

  res.json({ res: true, task: taskSaveToDB });
});

/* Put task update */
router.put('/task/:taskId', async function(req, res, next) {
  console.log('**** Put task update ****');

  var name = req.body.name;
  var description = req.body.description;
  var duedate = req.body.duedate;
  var dtclosure = req.body.dtclosure;
  var idassignee = req.body.idassignee;
  var idproject = req.body.idproject;
  var idsection = req.body.idsection;
  var follower = req.body.follower;
  var comment = req.body.comment;
  var iduser = req.body.iduser;

  var taskId = req.params.taskId;
  var task = await taskModel.findById(taskId);

  if (task) {
    task.name = name;
    task.description = description;
    task.duedate = duedate;
    task.dtclosure = dtclosure;
    task.idassignne = idassignee;
    task.idproject = idproject;
    task.idsection = idsection;
    task.follower = follower;

    /* create update event */
    var eventSaveToDB = await createevent(task._id, 'T', 'U', iduser);

    task.event.push(eventSaveToDB._id);

    /* Maj comment on task conversation */
    var reqconv = {
      comment
    };
    var conversation = await updateconversation(
      req.params.conversationId,
      reqconv
    );

    /* Save the task */
    var taskSaveToDB = await task.save();

    res.json({ res: true, task: taskSaveToDB });
  } else {
    res.json({ res: false, msg: 'Task not found !' });
  }
});

module.exports = router;
