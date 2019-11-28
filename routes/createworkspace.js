var workspaceModel = require('../models/workspace');

var createworkspace = async function(userId, projectId) {
  var newworkspace = new workspaceModel({
    user: userId,
    project: projectId
  });

  var workspaceSaveToDB = await newworkspace.save();

  return workspaceSaveToDB;
};

module.exports = createworkspace;
