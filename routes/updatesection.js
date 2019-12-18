var sectionModel = require('../models/section');
var projectModel = require('../models/project');

var moment = require('moment');

var updatesection = async function(workspace, sectionId, sectionFromFront) {
  var name;
  var newsection;
  var sectionSaveToDB;

  /* Create Sections for users and for project */
  if (sectionId === null) {
    if (workspace.iduser !== null) {
      name = 'Tasks assigned to me';
      newsection = new sectionModel({
        name,
        idworkspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Today';
      newsection = new sectionModel({
        name,
        idworkspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();

      name = 'Later';
      newsection = new sectionModel({
        name,
        idworkspace: workspace.id
      });
      sectionSaveToDB = await newsection.save();
    } else {
      var dtdeb;
      var duedate;
      if (workspace.idproject) {
        var project = await projectModel.findById(workspace.idproject);
        dtdeb = project.dtdeb;
        duedate = project.duedate;
      }

      if (duedate) {
        var dtfin = new Date(duedate);
        //var dtfin7 = new Date(duedate).setDate(new Date(duedate).getDate() + 7);

        var i = 0;
        //for (var d = dtdeb; d <= dtfin7; d.setDate(d.getDate() + 7)) {
        for (var d = dtfin; d > dtdeb; d.setDate(d.getDate() - 7)) {
          date = new Date(d);

          console.log('loop date', i, date);
          console.log('Week', moment(date, 'YYYY-MM-DD').week());

          var week = moment(date, 'YYYY-MM-DD').week();
          var year = date.getFullYear();

          name = 'Week ' + year + '-' + week;

          //console.log('name', name);

          newsection = new sectionModel({
            name,
            idworkspace: workspace.id
          });
          sectionSaveToDB = await newsection.save();

          i = i + 1;
        }
      }

      name = 'Backlog';
      newsection = new sectionModel({
        name,
        idworkspace: workspace.id
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
