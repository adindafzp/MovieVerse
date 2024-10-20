const { Op } = require("sequelize");
const { Movie, MovieVideo, Director, Actor, Genre } = require("../../models/index");

class PublicMovieController {
  // Create a new movie
  static async getPopular(req, res) {
    try {
      const movies = await Movie.findAll({
        where: {
          is_popular: true,
        },
        include: [
          {
            model: Genre,
            as: "Genres",
          },
        ],
      });
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  // Get all movies
  static async getAll(req, res) {
    console.log("all movies");
    try {
      const movies = await Movie.findAll({
        include: [
          {
            model: Genre,
            as: "Genres", // Menggunakan alias "Genres"
          },
          {
            model: Actor,
            as: "Actors", // Menggunakan alias "Actors"
          },
        ],
      });
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }  

  static async getTopRated(req, res) {
    try {
      const movies = await Movie.findAll({
        where: {
          rating: {
            [Op.gt]: 4.4, // Menampilkan movie dengan rating > 4.4
          },
        },
        include: [
          {
            model: Genre,
            as: "Genres", // Menggunakan alias yang sesuai
          },
        ],
      });
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
  }
  

  static async getMovieDetail(req, res) {
    try {
      const movie = await Movie.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: MovieVideo,
          },
          {
            model: Director,
          },
          {
            model: Actor,
            as: "Actors", // Gunakan alias sesuai asosiasi yang didefinisikan
          },
          {
            model: Genre,
            as: "Genres", // Menggunakan alias "Genres" sesuai dengan asosiasi
          },
        ],
      });
  
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
  
      // Fetching 5 recommended movies based on a criterion (for example, release date)
      const recommendations = await Movie.findAll({
        where: {
          id: {
            [Op.ne]: movie.id, // Exclude the current movie from recommendations
          },
        },
        order: [["release_date", "DESC"]], // Order by release date or any other criteria
        limit: 5, // Limit to 5 recommendations
      });
  
      return res.status(200).json({
        movie,
        recommendations,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }  
}

module.exports = PublicMovieController;