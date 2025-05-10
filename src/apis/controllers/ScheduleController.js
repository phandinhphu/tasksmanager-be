const taskSchema = require('../models/Task');
const statusSchema = require('../models/Status');
const scheduleSchema = require('../models/Schedule');

class ScheduleController {
    // [GET] /schedules/me
    async getMySchedules(req, res) {
        try {
            const userId = req.user.id; // Assuming you have user ID in req.user
            const schedules = await scheduleSchema.find({ userid: userId });
            return res.status(200).json(schedules);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    // [POST] /schedules/create
    async createSchedule(req, res) {
        try {
            const { title, days, startTime, endTime, repeat } = req.body;
            const userId = req.user.id; // Assuming you have user ID in req.user

            const newSchedule = new scheduleSchema({
                title,
                userid: userId,
                days,
                startTime,
                endTime,
                repeat
            });

            await newSchedule.save();
            return res.status(201).json(newSchedule);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // [PUT] /schedules/:id
    async updateSchedule(req, res) {
        try {
            const scheduleId = req.params.id;
            const { title, days, startTime, endTime, repeat } = req.body;

            const updatedSchedule = await scheduleSchema.findByIdAndUpdate(scheduleId, {
                title,
                days,
                startTime,
                endTime,
                repeat
            }, { new: true });

            if (!updatedSchedule) {
                return res.status(404).json({ message: 'Schedule not found' });
            }

            return res.status(200).json(updatedSchedule);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ScheduleController();