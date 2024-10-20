const { Op } = require("sequelize");
const { Actor, Movie, Series } = require("../../models/index");

class ActorControllerPublic {
  static async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: actors } = await Actor.findAndCountAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
      });

      return res.json({
        actors,
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
      const actor = await Actor.findOne({
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

      if (!actor) {
        return res.status(404).json({ message: "Actor not found" });
      }

      return res.json({ actor });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActorControllerPublic;
