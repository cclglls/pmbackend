var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var workspaceModel = require('../models/workspace');
var sectionModel = require('../models/section');
var projectModel = require('../models/project');

/* GET workspace */
router.get('/:projectId', async function(req, res, next) {
  console.log('**** Get workspace ****');

  var projectId = new mongoose.Types.ObjectId(req.params.projectId);
  var workspace = await workspaceModel.findOne({ idproject: projectId });

  var section = await sectionModel
    .find({ idworkspace: workspace._id })
    .populate('task');

  res.json({ res: true, section });
});

/* PUT workspace */
router.put('/sections', async function(req, res, next) {
  console.log('**** Put workspace sections ****');

  var sections = req.body.sections;

  console.log(sections);

  for (var i = 0; i < sections.length; i++) {
    var sectionId = new mongoose.Types.ObjectId(sections[i]._id);
    console.log('sectionId', sectionId);
    var task = sections[i].task.map(function(task) {
      return new mongoose.Types.ObjectId(task._id);
    });
    console.log('task', task);

    var section = await sectionModel.findById({ _id: sectionId });
    section.task = task;
    var sectionSaveToDB = await section.save();

    console.log('section', sectionSaveToDB);
  }

  res.json({ res: true });
});

module.exports = router;
