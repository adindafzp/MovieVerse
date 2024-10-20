const Actor = require("./Actor");
const Director = require("./Director");
const Movie = require("./Movie");
const MovieActor = require("./MovieActor");
const MovieVideo = require("./MovieVideo");
const Series = require("./Series");
const Genre = require('./Genre');
const MovieGenre = require('./MovieGenre'); // Tabel penghubung

// Define associations in one place

// Relasi Director dengan Movie dan Series
Director.hasMany(Movie, { foreignKey: "directorId" });
Director.hasMany(Series, { foreignKey: "directorId" });
Movie.belongsTo(Director, { foreignKey: "directorId" });
Series.belongsTo(Director, { foreignKey: "directorId" });

// Relasi Movie dengan MovieVideo
Movie.hasMany(MovieVideo, { foreignKey: "movieId" });
MovieVideo.belongsTo(Movie, { foreignKey: "movieId" });

// Relasi Many-to-Many antara Movie dan Actor
Movie.belongsToMany(Actor, { through: MovieActor, foreignKey: "movieId", as: "Actors" });
Actor.belongsToMany(Movie, { through: MovieActor, foreignKey: "actorId", as: "Movies" });

// Relasi Many-to-Many antara Movie dan Genre
Movie.belongsToMany(Genre, { through: MovieGenre, foreignKey: "movieId", as: "Genres" });
Genre.belongsToMany(Movie, { through: MovieGenre, foreignKey: "genreId", as: "Movies" });

module.exports = { Director, Movie, Series, MovieVideo, Actor, MovieActor, Genre, MovieGenre };
