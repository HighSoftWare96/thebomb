const API_URL = 'http://localhost:3001';
const SOCKETIO_ROOMID = '57e18c21-f9ea-4a1b-97b4-3723b7ffc667';
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

ioClient.on('game-started', (payload) => {
  console.log('Gioco partito!', payload);
});

ioClient.on('game-ended', (payload) => {
  console.log('Gioco finito!', payload);
});

ioClient.on('round-started', (payload) => {
  console.log('Round partito!', payload);
});

ioClient.on('round-ended', (payload) => {
  console.log('Round finito!', payload);
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
