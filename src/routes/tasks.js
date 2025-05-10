const express = require('express');
const route = express.Router();
const TaskController = require('../apis/controllers/TaskController');

const verifyToken = require('../middleware/auth');

route.get('/status', TaskController.getAllStatus); // Get all task statuses
route.get('/priority', TaskController.getAllPriority); // Get all task priorities

route.use(verifyToken);
route.get('/me', TaskController.getMyTasks); // Get all tasks for the logged-in user
route.post('/', TaskController.createTask); // Create a new task for the logged-in user
route.put('/:id', TaskController.updateTask); // Update a task by ID for the logged-in user
route.delete('/:id', TaskController.deleteTask); // Delete a task by ID for the logged-in user

module.exports = route;