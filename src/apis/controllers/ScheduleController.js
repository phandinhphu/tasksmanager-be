const Schedule = require('../models/Schedule');

class ScheduleController {
    // get /schedules/me
    async getMySchedules(req, res) {
        try {
            const userId = req.user.id || req.user._id;
            const schedules = await Schedule.find({ userid: userId });
            return res.status(200).json(schedules);
        } catch (error) {
            return res.status(500).json({
                message: 'Lỗi khi lấy danh sách lịch trình!',
                error: error.message
            });
        }
    }

    // post /schedules/create
    async createSchedule(req, res) {
        try {
            const { title, days, startTime, endTime, repeat } = req.body;
            const userId = req.user.id || req.user._id;

            if (!title || !days || !startTime || !endTime || !repeat) {
                return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc.' });
            }

            const newSchedule = new Schedule({
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
            return res.status(500).json({
                message: 'Không thể tạo lịch trình mới!',
                error: error.message
            });
        }
    }

    // put /schedules/:id
    async updateSchedule(req, res) {
        try {
            const scheduleId = req.params.id;
            const userId = req.user.id || req.user._id;
            const { title, days, startTime, endTime, repeat } = req.body;

            const updatedSchedule = await Schedule.findOneAndUpdate(
                { _id: scheduleId, userid: userId },
                { title, days, startTime, endTime, repeat },
                { new: true }
            );

            if (!updatedSchedule) {
                return res.status(404).json({ message: 'Không tìm thấy lịch trình hoặc bạn không có quyền chỉnh sửa.' });
            }

            return res.status(200).json(updatedSchedule);
        } catch (error) {
            return res.status(500).json({
                message: 'Cập nhật lịch trình thất bại!',
                error: error.message
            });
        }
    }

    // delete /schedules/:id
    async deleteSchedule(req, res) {
        try {
            const scheduleId = req.params.id;
            const userId = req.user.id || req.user._id;

            const deletedSchedule = await Schedule.findOneAndDelete({
                _id: scheduleId,
                userid: userId
            });

            if (!deletedSchedule) {
                return res.status(404).json({ message: 'Không tìm thấy lịch trình hoặc bạn không có quyền xóa.' });
            }

            return res.status(200).json({ message: 'Xóa lịch trình thành công.' });
        } catch (error) {
            return res.status(500).json({
                message: 'Xóa lịch trình thất bại!',
                error: error.message
            });
        }
    }
}

module.exports = new ScheduleController();
