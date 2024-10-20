const express = require('express');
const router = express.Router();
const PublicMovieController = require('../../controllers/public/MovieController');

// Pastikan semua rute memiliki callback function yang valid
router.get('/toprated', PublicMovieController.getTopRated);
router.get('/popular', PublicMovieController.getPopular);
router.get('/:id', PublicMovieController.getMovieDetail);
router.get('/', PublicMovieController.getAll);

module.exports = router;
