const { MoleculerError } = require("moleculer").Errors;

const notFound = function notFound(entityName, entityId) {
  return new MoleculerError(
    'Element not found', 404, 'NOT_FOUND', { entityName, entityId }
  );
};

const roomFull = function roomFull(roomId) {
  return new MoleculerError('Full room', 400, 'FULL_ROOM', { roomId });
};

const unauth = function unauth(message = 'Access Unauthorized') {
  return new MoleculerError(message, 401, 'UNAUTHORIZED');
};

module.exports = {
  notFound,
  roomFull,
  unauth
};