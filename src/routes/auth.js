const express = require('express');
const route = express.Router();
const AuthController = require('../apis/controllers/AuthController');

route.post('/login', AuthController.login);
route.post('/register', AuthController.register);

module.exports = route;
