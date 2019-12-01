var sectionModel = require('../models/section');

var updatesection = async function(workspace, sectionId, sectionFromFront) {
  var name;
  var newsection;
  var sectionSaveToDB;

  /* Create Sections for users and for project */
  if (sectionId === null) {
    if (workspace.user !== null) {
      name = 'Tasks assigned to me';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Today';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Later';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();
    } else {
      name = 'Week 2019-51';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Week 2019-50';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Week 2019-49';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Backlog';
      newsection = new sectionModel({
        name,
        workspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();
    }
  } else {
    /* Update a section */
    var section = await sectionModel.findById({ sectionId });
    if (section) {
      section.name = sectionFromFront.name;
      section.task = [...sectionFromFront.task];
    }
  }

  return true;
};

module.exports = updatesection;
