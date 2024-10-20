// routes/movieRoutes.js
const express = require("express");
const MovieController = require("../controllers/MovieController");
const router = express.Router();

router.post("/", MovieController.create);
router.get("/", MovieController.getAll);
router.get("/:id", MovieController.getById);
router.put("/:id", MovieController.update);
router.delete("/:id", MovieController.delete);

module.exports = router;
