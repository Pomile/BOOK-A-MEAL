import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configs from '../config/config.json';
import operatorsAliases from '../operators/operatorsAliases';

/* ........................................................... */
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = configs[env];
config.operatorsAliases = operatorsAliases;
const db = {};

let sequelize;
if (config.environment === 'production') {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    timezone: process.env.TIMEZONE,
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    timezone: config.timezone,
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
