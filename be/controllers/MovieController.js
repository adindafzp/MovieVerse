// controllers/MovieController.js
const Movie = require("../models/Movie");

class MovieController {
  // Create a new movie
  static async create(req, res) {
    try {
      const movie = await Movie.create(req.body);
      return res.status(201).json(movie);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all movies
  static async getAll(req, res) {
    try {
      const movies = await Movie.findAll();
      return res.status(200).json(movies);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get a movie by ID
  static async getById(req, res) {
    try {
      const movie = await Movie.findByPk(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.status(200).json(movie);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update a movie
  static async update(req, res) {
    try {
      const [updated] = await Movie.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: "Movie not found" });
      }
      const updatedMovie = await Movie.findByPk(req.params.id);
      return res.status(200).json(updatedMovie);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete a movie
  static async delete(req, res) {
    try {
      const deleted = await Movie.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovieController;
