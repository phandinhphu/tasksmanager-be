const express = require('express');
const route = express.Router();
const ScheduleController = require('../apis/controllers/ScheduleController');

const verifyToken = require('../middleware/auth');

route.use(verifyToken);

route.get('/me', ScheduleController.getMySchedules);
route.post('/create', ScheduleController.createSchedule);
route.put('/:id', ScheduleController.updateSchedule);

module.exports = route;