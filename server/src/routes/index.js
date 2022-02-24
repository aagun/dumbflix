const express = require('express');
const router = express.Router();

// Controllers
const { login, register, checkAuth } = require('../controllers/auth');
const { addFilm, getFilm, getFilms, getFilmForBanner } = require('../controllers/film');
const { getCategories } = require('../controllers/category');

// Middleware
const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');
const { getUserProfile, getUserOrderHistory, getPurchasedFilm } = require('../controllers/user');

// Routes
router.post('/login', login);
router.post('/register', register);
router.get('/check-auth', auth, checkAuth);

// user
router.get('/profile', auth, getUserProfile);
router.get('/orders', auth, getUserOrderHistory);
router.get('/u/films', auth, getPurchasedFilm);

router.post('/film', auth, uploadFile('thumbnail'), addFilm);
router.get('/film/:id', auth, getFilm);
router.get('/g/film/:id', getFilm);
router.get('/films', getFilms);
router.get('/banner', auth, getFilmForBanner);

router.get('/categories', getCategories);

module.exports = router;
