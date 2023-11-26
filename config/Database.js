import { Sequelize } from "sequelize";

const db = new Sequelize('tlc_backend', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

export default db;