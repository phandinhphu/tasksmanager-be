const Task = require("../apis/models/Task");
const User = require("../apis/models/User");
const LogEmail = require("../apis/models/LogEmail");

// Hàm: Lấy các task và subtask quá hạn hoặc sắp đến hạn trong 3 ngày
async function getTasksDueSoon() {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + 3);

    const tasks = await Task.find({ completed: false })
        .populate("userid", "email name")
        .populate("status");

    const userTasksMap = {};

    tasks.forEach((task) => {
        const taskStart = new Date(task.start_date);
        const taskEnd = task?.extend_date
            ? new Date(task.extend_date)
            : new Date(task.end_date);

        let taskMessages = [];

        if (
            (taskEnd < now || (taskEnd >= now && taskEnd <= threeDaysLater)) &&
            taskStart <= now
        ) {
            const message =
                taskEnd < now
                    ? `Task "${task.task_name}" đã quá hạn!`
                    : `Task "${task.task_name}" sắp đến hạn trong 3 ngày.`;
            taskMessages.push(message);
        }

        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach((subtask) => {
                const subStart = new Date(subtask.start_date);
                const subEnd = subtask?.extend_date
                    ? new Date(subtask.extend_date)
                    : new Date(subtask.end_date);

                if (
                    (subEnd < now ||
                        (subEnd >= now && subEnd <= threeDaysLater)) &&
                    subStart <= now
                ) {
                    const message =
                        subEnd < now
                            ? `Subtask "${subtask.task_name}" đã quá hạn!`
                            : `Subtask "${subtask.task_name}" sắp đến hạn trong 3 ngày.`;
                    taskMessages.push(message);
                }
            });
        }

        if (taskMessages.length > 0) {
            const userId = task.userid._id.toString();

            if (!userTasksMap[userId]) {
                userTasksMap[task.userid._id] = {
                    email: task.userid.email,
                    name: task.userid.name,
                    notifications: [],
                    emails: [],
                };
            }

            // Lưu thông báo để gửi
            taskMessages.forEach((msg) => {
                userTasksMap[task.userid._id].notifications.push({
                    taskId: task._id,
                    taskName: task.task_name,
                    message: msg,
                });
                userTasksMap[task.userid._id].emails.push(msg);
            });
        }
    });

    return userTasksMap;
}

// Hàm: Kiểm tra mail trước khi gửi
async function checkEmailBeforeSend(payload) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const alreadySent = await LogEmail.findOne({
        to: payload.to,
        subject: payload.subject,
        sentAt: { $gte: oneDayAgo },
    });

    if (alreadySent) {
        return false; // Không gửi lại email
    }

    return true; // Cho phép gửi email
}

// Hàm: Dọn dẹp các tài khoản chưa xác thực sau 24h
async function cleanupUnverifiedAccounts() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now);
    twentyFourHoursAgo.setHours(now.getHours() - 24);

    // Tìm các tài khoản chưa xác thực và đã tạo hơn 24 giờ
    const unverifiedUsers = await User.find({
        verified: false,
        createdAt: { $lt: twentyFourHoursAgo },
    });

    if (unverifiedUsers.length > 0) {
        // Xử lý dọn dẹp tài khoản chưa xác thực
        await User.deleteMany({
            _id: { $in: unverifiedUsers.map((u) => u._id) },
        });
        return unverifiedUsers;
    }

    return [];
}

module.exports = {
    getTasksDueSoon,
    checkEmailBeforeSend,
    cleanupUnverifiedAccounts,
};
