var express = require('express');
var router = express.Router();

var projectModel = require('../models/project');

var createevent = require('./createevent');
var createworkspace = require('./createworkspace');
var updatesection = require('./updatesection');

/* GET projects */

router.get('/', async function(req, res, next) {
  console.log('**** Get projects ****');

  var project = await projectModel
    .find()
    .populate('idowner')
    .populate('event');

  res.json({ res: true, project });
});

/* Post project creation */
router.post('/project', async function(req, res, next) {
  console.log('**** Post project creation ****');

  var name = req.body.name;
  var description = req.body.description;
  var duedate = req.body.duedate;
  var idowner = req.body.idowner;

  var searchName = await projectModel.findOne({ name });

  if (!searchName) {
    /* Save the project */

    var newProject = new projectModel({
      name,
      description,
      duedate,
      idowner
    });

    var eventSaveToDB = await createevent(newProject._id, 'P', 'C');

    newProject.event.push(eventSaveToDB._id);

    var projectSaveToDB = await newProject.save();

    var workspaceSaveToDB = await createworkspace(null, projectSaveToDB._id);

    var section = await updatesection(workspaceSaveToDB, null, null);

    res.json({ res: true, project: projectSaveToDB });
  } else {
    res.json({
      res: false,
      msg: 'Project refused: this name is already used by another project'
    });
  }
});

module.exports = router;
