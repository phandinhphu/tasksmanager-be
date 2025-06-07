const express = require('express');
const jwt = require('jsonwebtoken');
const route = express.Router();
const passport = require("passport");
const dotenv = require('dotenv');
const AuthController = require('../apis/controllers/AuthController');

dotenv.config();

route.post('/login', AuthController.login);
route.post('/register', AuthController.register);
route.post('/logout', AuthController.logout);
route.get('/verify-email', AuthController.verifyEmail);
route.post('/forgot-password', AuthController.forgotPassword);
route.post('/reset-password', AuthController.resetPassword);

// Google authentication
route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
route.get('/google/callback', passport.authenticate("google", { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.cookie('token', token, {
        httpOnly: true,       // Không cho JS truy cập
        secure: true,          
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.redirect(`${process.env.FRONTEND_URL}/`);
});

// Facebook authentication
route.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook callback
route.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.cookie('token', token, {
        httpOnly: true,       // Không cho JS truy cập
        secure: true,           
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.redirect(`${process.env.FRONTEND_URL}/`);
});

module.exports = route;
