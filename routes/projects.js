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
  var dtdeb = req.body.dtdeb;
  var duedate = req.body.duedate;
  var idowner = req.body.idowner;
  var iduser = req.body.iduser;

  var searchName = await projectModel.findOne({ name });

  if (!searchName) {
    /* Save the project */

    var newProject = new projectModel({
      name,
      description,
      duedate,
      idowner
    });

    var eventSaveToDB = await createevent(
      newProject._id,
      'P',
      'C',
      iduser,
      dtdeb
    );

    newProject.event.push(eventSaveToDB._id);
    newProject.dtdeb = eventSaveToDB.dtevent;

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

/* Put project creation */
router.put('/project/:projectId', async function(req, res, next) {
  console.log('**** Put project update ****');

  var name = req.body.name;
  var description = req.body.description;
  var duedate = req.body.duedate;
  var idowner = req.body.idowner;
  var iduser = req.body.iduser;

  console.log('due date', duedate);

  var projectId = req.params.projectId;
  var project = await projectModel.findById(projectId);

  if (project) {
    project.name = name;
    project.description = description;
    project.duedate = duedate;
    project.idowner = idowner;

    /* create update event */
    var eventSaveToDB = await createevent(project._id, 'T', 'U', iduser);

    project.event.push(eventSaveToDB._id);

    /* Save the project */
    var projectSaveToDB = await project.save();

    res.json({ res: true, project: projectSaveToDB });
  } else {
    res.json({ res: false, msg: 'Project not found !' });
  }
});

module.exports = router;
