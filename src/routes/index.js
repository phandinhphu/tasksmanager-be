const express = require("express");
const route = express.Router();
const authRoutes = require("./auth");
const taskRoutes = require("./tasks");
const scheduleRoutes = require("./schedules");
const userRoutes = require("./user");

route.use("/auth", authRoutes);
route.use("/tasks", taskRoutes);
route.use("/schedules", scheduleRoutes);
route.use("/users", userRoutes);

module.exports = route;
