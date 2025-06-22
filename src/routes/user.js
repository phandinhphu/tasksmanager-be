const express = require("express");
const route = express.Router();
const UserController = require("../apis/controllers/UserController");

const verifyToken = require("../middleware/auth");
const feedbackLimiter = require("../middleware/feedbackLimiter");

route.use(verifyToken);

route.get("/me", UserController.getMe);
route.put("/me/update-profile", UserController.updateProfile);
route.delete("/me/delete-account", UserController.deleteAccount);
route.post("/me/feedback", feedbackLimiter, UserController.sendFeedback);

module.exports = route;
