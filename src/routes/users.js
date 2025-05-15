const express = require('express');
const route = express.Router();
const UserController = require('../apis/controllers/UserController');
const verifyToken = require('../middleware/auth');

route.use(verifyToken);

route.get('/me', UserController.getProfile);
route.put('/me/avatar', UserController.updateAvatar);

module.exports = route;