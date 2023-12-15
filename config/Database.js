const { Sequelize } = require("sequelize");

const db = new Sequelize('tlc_backend', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = db;