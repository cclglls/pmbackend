var express = require('express');
var router = express.Router();

var taskModel = require('../models/task');
var projectModel = require('../models/project');

var createevent = require('./createevent');

/* GET tasks */

router.get('/', async function(req, res, next) {
  console.log('**** Get tasks ****');

  var task = await taskModel
    .find()
    .populate('idassignee')
    .populate('idproject')
    .populate('idsection')
    .populate('idconv')
    .populate('event');

  res.json({ res: true, task });
});

/* Post task creation */
router.post('/task', async function(req, res, next) {
  console.log('**** Post task creation ****');

  var name = req.body.name;
  var description = req.body.description;
  var duedate = req.body.duedate;
  var idassignee = req.body.idassignee;
  var idproject = req.body.idproject;
  var idsection = req.body.idsection;
  var idconversation = req.body.idconversation;
  var follower = req.body.follower;

  /* Save the task */
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

  var eventSaveToDB = await createevent(newtask._id, 'T', 'C');

  newtask.event.push(eventSaveToDB._id);

  var taskSaveToDB = await newtask.save();

  res.json({ res: true, task: taskSaveToDB });
});

module.exports = router;
