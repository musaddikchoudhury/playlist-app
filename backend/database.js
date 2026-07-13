const { Sequelize } = require('sequelize');

const db = new Sequelize('playlist_db', 'postgres', 'taskapi123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, 
});

module.exports = db;