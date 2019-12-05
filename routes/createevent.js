var eventModel = require('../models/event');

var createevent = async function(Id, entity, type, iduser, dtevt) {
  var dtevent = new Date();

  if (dtevt) dtevent = dtevt;

  var userId = null;
  var projectId = null;
  var taskId = null;
  var convId = null;
  var commentId = null;
  var statusId = null;

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
    case 'S':
      statusId = Id;
      break;
  }

  var newEvent = new eventModel({
    dtevent,
    user: iduser,
    entity,
    type,
    iduser: userId,
    idproject: projectId,
    idtask: taskId,
    idconversation: convId,
    idcomment: commentId,
    idstatus: statusId
  });

  var eventSaveToDB = await newEvent.save();

  return eventSaveToDB;
};

module.exports = createevent;
