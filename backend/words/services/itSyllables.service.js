const DbService = require('moleculer-db');
const SqlAdapter = require('moleculer-db-adapter-sequelize');
const Sequelize = require('sequelize');
const { db } = require('config');

module.exports = {
  name: 'itSyllables',
  mixins: [DbService],
  adapter: new SqlAdapter(db.connectionString),
  model: {
    name: 'itSyllables',
    define: {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      syllable: {
        type: Sequelize.STRING,
        unique: true
      },
      difficulty: {
        type: Sequelize.FLOAT
      }
    },
    options: {
      indexes: [{
        unique: true,
        fields: ['id']
      }, {
        unique: true,
        fields: ['syllable']
      },
      {
        fields: ['difficulty']
      }]
    }
  },
  actions: {
    getRandom: {
      params: {
        difficulty: {
          type: 'number',
          integer: true,
          convert: true,
          optional: true,
          positive: true
        }
      },
      handler(ctx) {
        const { difficulty } = ctx.params;
        return this.model.findOne({
          order: Sequelize.literal('random()'),
          where: {
            difficulty: {
              [Sequelize.Op.lte]: difficulty || 5
            }
          }
        });
      }
    }
  }
};
