const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db } = require('config');

module.exports = {
  name: 'itWords',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: 'itWords',
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      word: {
        type: Sequelize.STRING
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        fields: ['word']
      }]
    }
  }
};
