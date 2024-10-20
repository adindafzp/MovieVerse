const { Op } = require("sequelize");
const { Genre, Movie } = require("../../models/index"); // Pastikan untuk mengimpor model Genre

class GenreControllerPublic {
  // Mengambil semua genre dengan pagination
  static async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: genres } = await Genre.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      return res.json({
        genres,
        meta: {
          totalItems: count,
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Mengambil genre berdasarkan ID
  static async getById(req, res, next) {
    try {
      const genre = await Genre.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Movie, // Mengaitkan dengan model Movie jika perlu
          },
        ],
      });

      if (!genre) {
        return res.status(404).json({ message: "Genre not found" });
      }

      return res.json({ genre });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GenreControllerPublic;
