const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db } = require('config');
const { entityNotFound, badReq } = require('helpers/errors');
const { sortBy } = require('lodash');

module.exports = {
  name: 'game',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  metadata: {
    timeoutsCache: {}
  },
  model: {
    name: 'game',
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      // id della stanza a cui il gioco fa riferimento
      roomId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // STATO DEL GIOCO
      // contatore dei ruond giocati
      currentRounds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      // id del round in gioco
      currentRoundId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      // OPZIONI PER LA partita
      // numero di round totali
      rounds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      // minima durata di un ruond
      minTimeS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30
      },
      // massima durata di un ruond
      maxTimeS: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 80
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: false,
        fields: ['roomId']
      }]
    }
  },
  actions: {
    start: {
      params: {
        rounds: {
          type: 'number',
          integer: true,
          positive: true,
          min: 1,
          max: 30,
          convert: true
        },
        roomId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        minTimeS: {
          optional: true,
          min: 10,
          max: 40,
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        maxTimeS: {
          optional: true,
          min: 30,
          max: 240,
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
      },
      async handler(ctx) {
        try {
          const { rounds, roomId, minTimeS = 30, maxTimeS = 80 } = ctx.params;

          if (minTimeS >= maxTimeS) {
            return Promise.reject(badReq());
          }

          // recupero la stanza
          const room = await this.broker.call('room.get', {
            id: roomId
          });

          // stanza inesistente => fallisco
          if (!room) {
            return Promise.reject(
              entityNotFound('room', roomId)
            );
          }

          // creo nuova partita
          const game = await this._create(ctx, {
            rounds,
            roomId,
            minTimeS,
            maxTimeS,
            currentRounds: 0
          });

          // start game event
          await this.broker.call('socketio.startGame', {
            socketioRoom: room.socketioRoom,
            game
          });

          // faccio partire il primo round
          return this.broker.call('game.nextRound', {
            id: game.id
          });
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    nextRound: {
      params: {
        id: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        },
        previousRoundId: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true,
          optional: true
        }
      },
      async handler(ctx) {
        try {
          const { id, previousRoundId } = ctx.params;

          // recupero la partita
          const game = await this._get(ctx, {
            id
          });

          // recupero stanza
          const room = await this.broker.call('room.get', {
            id: game.roomId
          });

          let previousRound = undefined;

          if (previousRoundId !== undefined) {
            // non è il primo round, è stato giocato un round
            game.currentRounds = game.currentRounds + 1;
            previousRound = await this.broker.call('round.get', {
              id: previousRoundId
            });
          }

          if (game.currentRounds === game.rounds) {
            // faccio partire il primo round
            return this.broker.call('game.endGame', {
              id: game.id
            });
          } else {
            // creo il prossimo round
            const nextRound = await this.broker.call('round.create', {
              gameId: game.id,
              // TODO: create random syllable
              syllable: 'AE',
              // incomincia chi aveva perso il round precedente o se non c'è più
              // il primo
              currentPartecipantId:
                previousRound ?
                  room.partecipantIds.find(i => i === previousRound.currentPartecipantId) :
                  room.partecipantIds[0]
            });

            // aggiorno il roundId della partita
            const updatedGame = await this._update(ctx, {
              id: game.id,
              currentRoundId: nextRound.id,
              currentRounds: game.currentRounds
            });

            // start round event
            await this.broker.call('socketio.startRound', {
              socketioRoom: room.socketioRoom,
              round: nextRound
            });

            // pianifico il prossimo round
            this.planNextRound(updatedGame, nextRound, room);

            return Promise.resolve({
              game: updatedGame,
              round: nextRound
            });
          }
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    endGame: {
      params: {
        id: {
          type: 'number',
          integer: true,
          positive: true,
          convert: true
        }
      },
      async handler(ctx) {
        try {
          const { id } = ctx.params;

          const game = await this.broker.call('game.get', {
            id
          });

          const room = await this.broker.call('room.get', {
            id: game.roomId
          });

          // recupero statistiche per giocatore
          const rounds = await this.broker.call('round.find', {
            gameId: id
          });

          let statistics = [];

          // recupero i partecipanti e li salvo mappandoli per ID
          for (const partecipantId of room.partecipantIds) {
            const partecipant = await this.broker.call('partecipant.get', { id: partecipantId });
            statistics.push({
              ...partecipant,
              lostRounds: 0
            });
          }

          rounds.forEach(round => {
            const lostPartecipantIdx = statistics.findIndex(p => p.id === round.currentPartecipantId);
            // ha perso un round
            statistics[lostPartecipantIdx].lostRounds += 1;
          });

          // ordino
          statistics = sortBy(statistics, 'lostRounds');

          await this.broker.call('socketio.endGame', {
            socketioRoom: room.socketioRoom,
            game,
            statistics
          });

          return this.broker.call('game.destroy', {
            id: game.id
          });
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    },
    destroy: {
      params: {
        id: {
          type: 'number',
          convert: true,
          integer: true,
          positive: true
        }
      },
      async handler(ctx) {
        try {
          const { id } = ctx.params;
          await this.broker.call('round.removeByGameId', {
            gameId: id
          });
          return this._remove(ctx, { id });
        } catch (e) {
          this.logger.error(e);
          return Promise.reject(e);
        }
      }
    }
  },
  methods: {
    // pianifica la fine e l'inizio di un round random
    planNextRound(game, currentRound, room) {
      clearTimeout(this.metadata.timeoutsCache[game.id]);
      // genero timer random per far finire il round
      // creo la cache per questo game
      this.metadata.timeoutsCache[game.id] = setTimeout(
        async () => {
          // blocco il round
          const roundEnded = await this.broker.call('round.update', {
            id: currentRound.id,
            ended: true
          });
          // evento di fine round
          await this.broker.call('socketio.endRound', {
            socketioRoom: room.socketioRoom,
            round: roundEnded
          });
          // parto con il prossimo round
          await this.broker.call('game.nextRound', {
            id: game.id,
            previousRoundId: currentRound.id
          });
        },
        Math.floor(Math.random() * (game.maxTimeS - game.minTimeS + 1) + game.minTimeS) * 1000
      );
    }
  }
};
