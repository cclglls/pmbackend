var workspaceModel = require('../models/workspace');

var createworkspace = async function(userId, projectId) {
  var newworkspace = new workspaceModel({
    iduser: userId,
    idproject: projectId
  });

  var workspaceSaveToDB = await newworkspace.save();

  return workspaceSaveToDB;
};

module.exports = createworkspace;
