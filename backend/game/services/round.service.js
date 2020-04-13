const DbService = require("moleculer-db");
const { actions: DbActions } = DbService;
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const { db } = require('config');

module.exports = {
  name: "round",
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: "round",
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      syllable: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // round finito o in gioco
      ended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // STATO del RUOND
      currentPartecipantId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: false,
        fields: ['gameId']
      }]
    }
  }
};
