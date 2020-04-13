const API_URL = 'http://localhost:3001'
const SOCKETIO_ROOMID = '62d2c863-1eb1-44ff-8776-757e28086baa';
const PARTECIPANT_ID = 1;
const NAMESPACE = 'multiplayer';

const
  io = require("socket.io-client"),
  ioClient = io.connect(API_URL + '/' + NAMESPACE, {
    transports: ['websocket', 'polling'],
    query: {
      socketioRoom: SOCKETIO_ROOMID,
      partecipantId: PARTECIPANT_ID
    }
  });

ioClient.on('connect', () => {
  console.log('Client connected');
});

ioClient.emit('join-room', {
  socketioRoom: SOCKETIO_ROOMID,
  partecipantId: PARTECIPANT_ID
});

ioClient.on('room-joined', (payload) => {
  console.log('⛺️Joined room!', payload);
});

ioClient.on('new-roomate', (payload) => {
  console.log('🙇🏻‍♂️New partecipant!', payload);
});

ioClient.on('error', (error) => {
  console.log('System error', error);
});

ioClient.on('client-error', (error) => {
  console.log('Client error', error);
});

ioClient.on('server-error', (error) => {
  console.log('Server error', error);
});

ioClient.on('disconnect', () => {
  console.log('Client disconnected');
});
