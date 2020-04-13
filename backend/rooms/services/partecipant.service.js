const DbService = require("moleculer-db");
const { actions: DbActions } = DbService;
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const { db } = require('config');

module.exports = {
  name: "partecipant",
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: "partecipant",
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      // alias nome del giocatore
      name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      // seed per la generazione univoca dell'avatar
      // lato UI
      avatarSeed: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      // id della socket di socketio a cui il giocatore è collegato
      socketId: {
        // TODO: ? stringa o numero
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: true,
        fields: ['socketId']
      }]
    }
  }
};
