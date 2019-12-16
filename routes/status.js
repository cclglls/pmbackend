var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var statusModel = require('../models/status');
var progress = require('../models/progress');
var progressModel = progress.progressModel;
var projectModel = require('../models/project');
var taskModel = require('../models/task');
var conversations = require('./conversations');
conversationModel = conversations.conversationModel;
var createconversation = conversations.createconversation;
var updateconversation = conversations.updateconversation;
var commentModel = require('../models/comment');
var eventModel = require('../models/event');

var createevent = require('./createevent');

/* GET status */

router.get('/:projectId', async function(req, res, next) {
  console.log('**** Get status ****');

  var projectId;
  if (req.params.projectId !== '0')
    projectId = new mongoose.Types.ObjectId(req.params.projectId);

  var status = await statusModel.find({ idproject: projectId }).populate([
    {
      path: 'idconversation',
      model: conversationModel,
      populate: { path: 'comment', model: commentModel }
    },
    { path: 'event', model: eventModel }
  ]);

  res.json({ res: true, status });
});

/* Post status creation */
router.post('/status', async function(req, res, next) {
  console.log('**** Post status creation ****');

  var idproject = req.body.idproject;
  var dtstatus = req.body.dtstatus;
  var status = req.body.status;
  var comment = req.body.comment;
  var chartProgress = req.body.chartProgress;
  var iduser = req.body.iduser;

  /* Create status */
  var newstatus = new statusModel({
    idproject,
    dtstatus,
    status,
    chartProgress
  });

  /* Init status conv : only one */
  name = 'Conversation on status id ' + newstatus._id;
  var body = {
    name,
    idproject,
    type: 'status',
    comment
  };
  var reqconv = { body };

  var result = await createconversation(reqconv);
  console.log('conversation', result);
  newstatus.idconversation = result.conversation._id;

  /* Maj comment on task conversation 
  var body = {
    comment: [{ _id: '0', comment: convFirstComment }]
  };
  var reqconv = { body };
  var conversation = await updateconversation(
    newstatus.idconversation,
    reqconv
  );
  */

  /* Event 'C' */
  var eventSaveToDB = await createevent(newstatus._id, 'S', 'C', iduser);

  newstatus.event.push(eventSaveToDB._id);

  console.log('chartprogress', chartProgress);

  if (chartProgress) {
    /* Create Progress */
    var progress = [];
    var dtstat;
    var tasks_created;
    var tasks_closed;
    var tasks;
    var project = await projectModel.findById(idproject);

    /*console.log(
      project.dtdeb,
      new Date(dtstatus),
      project.dtdeb <= new Date(dtstatus)
    );*/

    var dtfin = new Date(dtstatus);
    var dtfin7 = new Date(dtstatus).setDate(new Date(dtstatus).getDate() + 7);

    var i = 0;
    for (var d = project.dtdeb; d <= dtfin7; d.setDate(d.getDate() + 7)) {
      console.log('loop date', i, new Date(d));

      dtstat = new Date(d);
      //console.log(dtstat, dtfin, dtstat > dtfin);
      if (dtstat > dtfin) dtstat = dtfin;

      var tasks = await taskModel.find({ dtdeb: { $lte: dtstat } });

      tasks_created = tasks.length;
      tasks_closed = 0;
      for (var j = 0; j < tasks.length; j++) {
        if (tasks[j].dtclosure) tasks_closed++;
      }

      progress[i] = {
        dtstat,
        tasks_created,
        tasks_closed
      };

      console.log('progress', i, progress[i]);

      /* Save progress in status */
      var newprogress = new progressModel({
        dtstat,
        tasks_created,
        tasks_closed
      });
      newstatus.progress.push(newprogress);

      i = i + 1;
    }
  }

  /* Save status */
  var statusSaveToDB = await newstatus.save();

  res.json({ res: true, status: statusSaveToDB });
});

/* Put status */
router.put('/status/:statusId', async function(req, res, next) {
  console.log('**** Put status update ****');

  var status = await statusModel.findById(req.params.statusId);
  var result = await updateconversation(status.idconversation, req);

  res.json(result);
});

module.exports = router;
