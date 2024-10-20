const { Model, DataTypes } = require('sequelize');
const sequelize = require('../library/database');
const Movie = require("./Movie");
const Genre = require("./Genre");

class MovieGenre extends Model {}

MovieGenre.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,
        key: 'id',
      },
      allowNull: false,
    },
    genreId: {
      type: DataTypes.INTEGER,
      references: {
        model: Genre,
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'MovieGenre',
    tableName: 'movie_genre', // Nama tabel penghubung
    timestamps: false,
  }
);

module.exports = MovieGenre;
