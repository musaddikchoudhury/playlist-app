const { DataTypes } = require('sequelize');
const db = require('./database');

const Playlist = db.define('Playlist', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
});

const Song = db.define('Song', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

Playlist.hasMany(Song);
Song.belongsTo(Playlist);

module.exports = { db, Playlist, Song };