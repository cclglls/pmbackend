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
router.get('/:projectId/:userId/:word', async function(req, res, next) {
  console.log('**** Get tasks ****');

  var projectId;
  var userId;

  if (req.params.projectId !== '0')
    projectId = new mongoose.Types.ObjectId(req.params.projectId);
  if (req.params.userId !== '0')
    userId = new mongoose.Types.ObjectId(req.params.userId);

  var word;
  if (req.params.word) word = req.params.word;

  var searchObject = {};
  if (projectId) searchObject = { idproject: projectId };
  if (userId) searchObject = { idassignee: userId };

  if (word !== '' && word !== '*')
    searchObject = { name: { $regex: word, $options: 'i' } };

  //console.log(searchObject);

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
  var follower = req.body.follower;
  var iduser = req.body.iduser;
  var comment = req.body.comment;

  /* Create task */
  var newtask = new taskModel({
    name,
    description,
    duedate,
    idassignee,
    idproject,
    idsection,
    comment,
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
    type: 'conversation',
    comment
  };
  var reqconv = { body };

  var result = await createconversation(reqconv);

  newtask.idconversation = result.conversation._id;

  /* Save the task */
  var taskSaveToDB = await newtask.save();

  /* Ajout tache dans le workspace project */
  var workspace = await workspaceModel.findOne({
    idproject
  });

  //console.log(workspace);

  section = await sectionModel.findOne({
    idworkspace: workspace._id,
    name: 'Backlog'
  });
  //console.log(section, taskSaveToDB._id);
  section.task.push(taskSaveToDB._id);
  var sectionSaveToDB = await section.save();
  console.log('Project sectionSaveToDB', sectionSaveToDB);

  /* Ajout tache dans le workspace user */
  var workspace = await workspaceModel.findOne({
    iduser: idassignee
  });

  //console.log(workspace);

  section = await sectionModel.findOne({
    idworkspace: workspace._id,
    name: 'Tasks assigned to me'
  });
  //console.log(section, taskSaveToDB._id);
  section.task.push(taskSaveToDB._id);
  sectionSaveToDB = await section.save();
  console.log('User sectionSaveToDB', sectionSaveToDB);

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
    var old_idproject = task.idproject;

    var z = 'U';
    if (!task.dtclosure && dtclosure) z = 'E'; /* End = Closure */
    if (name) task.name = name;
    if (description) task.description = description;
    if (duedate) task.duedate = duedate;
    task.dtclosure = dtclosure;
    if (idassignee) task.idassignne = idassignee;
    if (idproject) task.idproject = idproject;
    if (idsection) task.idsection = idsection;
    if (follower) task.follower = follower;

    /* create update event */

    var eventSaveToDB = await createevent(task._id, 'T', z, iduser);

    task.event.push(eventSaveToDB._id);

    /* Maj comment on task conversation */
    //console.log('comment', comment);

    if (comment) {
      var body = {
        comment
      };
      var reqconv = { body };
      var conversation = await updateconversation(task.idconversation, reqconv);
    }

    /* Update project */
    var sectionSaveToDB;

    if (task.idproject.toString() !== old_idproject.toString()) {
      /* Ajout tache dans le workspace project */
      console.log('new idproject', task.idproject);

      var workspace = await workspaceModel.findOne({
        idproject: task.idproject
      });

      section = await sectionModel.findOne({
        idworkspace: workspace._id,
        name: 'Backlog'
      });

      var index = section.task.findIndex(sectiontask => {
        var ch1 = sectiontask._id.toString();
        var ch2 = task._id.toString();
        if (ch1 === ch2) return true;
        else return false;
      });

      console.log('index ajout', index);

      if (index < 0) {
        section.task.push(task._id);
        sectionSaveToDB = await section.save();
      }
    }

    if (old_idproject.toString() !== task.idproject.toString()) {
      /* Suppression tache dans l'ancien workspace project */
      console.log('old_idproject', old_idproject);

      var workspace = await workspaceModel.findOne({
        idproject: old_idproject
      });

      section = await sectionModel.findOne({
        idworkspace: workspace._id,
        name: 'Backlog'
      });

      index = section.task.findIndex(sectiontask => {
        var ch1 = sectiontask._id.toString();
        var ch2 = task._id.toString();
        if (ch1 === ch2) return true;
        else return false;
      });

      console.log('index', index);

      if (index >= 0) {
        section.task.splice(index, 1);
        sectionSaveToDB = await section.save();
      }
    }

    /* Save the task */
    var taskSaveToDB = await task.save();

    res.json({ res: true, task: taskSaveToDB });
  } else {
    res.json({ res: false, msg: 'Task not found !' });
  }
});

module.exports = router;
