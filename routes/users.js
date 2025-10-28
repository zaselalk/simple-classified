const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const { isLoggedIn, validateUser } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(validateUser, catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

router.get('/profile', isLoggedIn, catchAsync(users.renderProfile));

router.route('/profile/change-password')
    .get(isLoggedIn, users.renderChangePassword)
    .post(isLoggedIn, catchAsync(users.changePassword));

module.exports = router;
