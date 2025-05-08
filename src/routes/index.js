const express = require('express');
const route = express.Router();
const authRoutes = require('./auth');

route.use('/auth', authRoutes);

module.exports = route;
