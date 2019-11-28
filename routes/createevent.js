var eventModel = require('../models/event');

var createevent = async function(Id, entity, type) {
  var dtevent = new Date();

  var userId = null;
  var projectId = null;
  var taskId = null;
  var convId = null;
  var commentId = null;

  switch (entity) {
    case 'U':
      userId = Id;
      break;
    case 'P':
      projectId = Id;
      break;
    case 'T':
      taskId = Id;
      break;
    case 'CV':
      convId = Id;
      break;
    case 'CT':
      commentId = Id;
      break;
  }

  var newEvent = new eventModel({
    dtevent,
    user: userId,
    project: projectId,
    task: taskId,
    conversation: convId,
    comment: commentId,
    entity,
    type
  });

  var eventSaveToDB = await newEvent.save();

  return eventSaveToDB;
};

module.exports = createevent;
