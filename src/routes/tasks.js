const express = require("express");
const route = express.Router();
const TaskController = require("../apis/controllers/TaskController");

const verifyToken = require("../middleware/auth");

route.get("/status", TaskController.getAllStatus);
route.get("/priority", TaskController.getAllPriority);

route.use(verifyToken);
route.get("/me", TaskController.getMyTasks);
route.get("/stats", TaskController.getTaskStats);
route.get("/:id", TaskController.getTaskById);
route.post("/", TaskController.createTask);
route.put("/:id", TaskController.updateTask);
route.put("/:id/complete", TaskController.completeTask);
route.put("/:id/subtasks/:subtaskId/complete", TaskController.completeSubtask);
route.delete("/:id", TaskController.deleteTask);

module.exports = route;
