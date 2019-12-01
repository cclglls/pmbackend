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

module.exports = router;
