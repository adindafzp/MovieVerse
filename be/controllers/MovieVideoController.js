const { MovieVideo, Movie } = require("../models/index");

class MovieVideoController {
  // Create a new movie video
  static async create(req, res) {
    const { url, title, movieId } = req.body;

    try {
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      const newVideo = await MovieVideo.create({ url, title, movieId });
      return res.status(201).json(newVideo);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all videos for a specific movie
  static async getVideosByMovie(req, res) {
    try {
      const { movieId } = req.params;
      const movie = await Movie.findByPk(movieId, {
        include: [{ model: MovieVideo }],
      });

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      return res.status(200).json(movie.MovieVideos);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await MovieVideo.findByPk(id);

      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      return res.status(200).json(video);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { url, title, movieId } = req.body;

      const video = await MovieVideo.findByPk(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      await video.update({ url, title, movieId });
      return res.status(200).json(video);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const video = await MovieVideo.findByPk(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      await video.destroy();
      return res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovieVideoController;
