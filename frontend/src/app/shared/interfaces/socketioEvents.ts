export const events = {
  fromServer: {
    roomJoined: 'room-joined',
    newRoomate: 'new-roomate',
    roomateLeft: 'roomate-left',
    clientError: 'client-error',
    serverError: 'server-error',
    gameStarted: 'game-started',
    gameEnded: 'game-ended',
    roundStarted: 'round-started',
    roundEnded: 'round-ended',
    turnChecked: 'turn-checked',
    turnWrong: 'turn-wrong'
  },
  fromClient: {
    turnCheck: 'turn-check',
  }
};