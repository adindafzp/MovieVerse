const { Op } = require("sequelize");
const { Director, Movie, Series } = require("../../models/index");

class DirectorControllerPublic {
  static async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: directors } = await Director.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      return res.json({
        directors,
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

  static async getById(req, res, next) {
    try {
      const director = await Director.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: Movie,
          },
          {
            model: Series,
          },
        ],
      });

      if (!director) {
        return res.status(404).json({ message: "Director not found" });
      }

      return res.json({ director });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DirectorControllerPublic;
