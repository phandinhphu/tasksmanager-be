const express = require('express');
const router = express.Router();
const ScheduleController = require('../apis/controllers/ScheduleController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

/**
 * @route   GET /api/schedules/me
 * @desc    Lấy tất cả lịch trình của người dùng hiện tại
 * @access  Private
 */
router.get('/me', ScheduleController.getMySchedules);

/**
 * @route   POST /api/schedules/create
 * @desc    Tạo lịch trình mới cho người dùng hiện tại
 * @access  Private
 */
router.post('/create', ScheduleController.createSchedule);

/**
 * @route   PUT /api/schedules/:id
 * @desc    Cập nhật lịch trình theo ID
 * @access  Private
 */
router.put('/:id', ScheduleController.updateSchedule);

/**
 * @route   DELETE /api/schedules/:id
 * @desc    Xóa lịch trình theo ID
 * @access  Private
 */
router.delete('/:id', ScheduleController.deleteSchedule);

module.exports = router;
