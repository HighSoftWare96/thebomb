const { MoleculerError } = require('moleculer').Errors;

const notFound = function notFound(entityName, entityId) {
  return new MoleculerError(
    'Element not found', 404, 'NOT_FOUND', { entityName, entityId }
  );
};

const roomFull = function roomFull(roomId) {
  return new MoleculerError('Full room', 400, 'FULL_ROOM', { roomId });
};

const badReq = function badReq(message = 'Bad request') {
  return new MoleculerError(message, 400, 'BAD_REQUEST');
};

module.exports = {
  notFound,
  roomFull,
  badReq,
  entityNotFound: notFound
};