// controllers/ActorController.js
const Actor = require("../models/Actor");

class ActorController {
  // Create a new actor
  static async create(req, res) {
    try {
      const actor = await Actor.create(req.body);
      return res.status(201).json(actor);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get all actors
  static async getAll(req, res) {
    try {
      const actors = await Actor.findAll();
      return res.status(200).json(actors);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Get an actor by ID
  static async getById(req, res) {
    try {
      const actor = await Actor.findByPk(req.params.id);
      if (!actor) {
        return res.status(404).json({ message: "Actor not found" });
      }
      return res.status(200).json(actor);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Update an actor
  static async update(req, res) {
    try {
      const [updated] = await Actor.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ message: "Actor not found" });
      }
      const updatedActor = await Actor.findByPk(req.params.id);
      return res.status(200).json(updatedActor);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Delete an actor
  static async delete(req, res) {
    try {
      const deleted = await Actor.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Actor not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ActorController;
