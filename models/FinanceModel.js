const { Sequelize } = require("sequelize");
const db = require('../config/Database.js');

const { DataTypes } = Sequelize;

const Finances = db.define('finances', {
  month: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  income: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  outcome: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  freezeTableName: true
})

module.exports = Finances