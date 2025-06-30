const Task = require("../apis/models/Task");
const Status = require("../apis/models/Status");
const User = require("../apis/models/User");
const LogEmail = require("../apis/models/LogEmail");

// Hàm: Tính số ngày giữa hai ngày
function getDaysBetween(fromDate, toDate) {
    const diffMs = toDate.getTime() - fromDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) {
        return `trong ${diffDays} ngày nữa`;
    } else if (diffHours >= 1) {
        return `trong ${diffHours} giờ nữa`;
    } else if (diffMinutes >= 1) {
        return `trong ${diffMinutes} phút nữa`;
    } else {
        return "rất sớm (dưới 1 phút)";
    }
}

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
            const daysUntilEndMsg = getDaysBetween(now, taskEnd);

            const message =
                taskEnd < now
                    ? `Task "${task.task_name}" đã quá hạn!`
                    : `Task "${task.task_name}" sắp đến hạn ${daysUntilEndMsg}.`;
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
                    const daysUntilSubEndMsg = getDaysBetween(now, subEnd);

                    const message =
                        subEnd < now
                            ? `Subtask "${subtask.task_name}" đã quá hạn!`
                            : `Subtask "${subtask.task_name}" sắp đến hạn ${daysUntilSubEndMsg}.`;
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

// Hàm: Lấy các task và subtask upcoming trong 3 ngày
async function getUpcomingTasks() {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + 3);

    const statusTodo = await Status.findOne({ name: "To Do" });

    // Lấy tất cả các task chưa hoàn thành, chưa bắt đầu và có ngày bắt đầu trong 3 ngày tới
    const tasks = await Task.find({
        completed: false,
        status: statusTodo._id,
        start_date: { $gte: now, $lte: threeDaysLater },
    })
        .populate("userid", "email name")
        .populate("status");

    const userTasksMap = {};
    tasks.forEach((task) => {
        let taskMessages = [];

        const taskStart = new Date(task.start_date);
        const daysUntilStartMsg = getDaysBetween(now, taskStart);

        const message = `Task "${task.task_name}" sẽ bắt đầu ${daysUntilStartMsg}.`;
        taskMessages.push(message);

        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach((subtask) => {
                const subStart = new Date(subtask.start_date);

                if (subStart >= now && subStart <= threeDaysLater) {
                    const daysUntilSubStartMsg = getDaysBetween(now, subStart);

                    const message = `Subtask "${subtask.task_name}" sẽ bắt đầu ${daysUntilSubStartMsg}.`;
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
        text: payload.text,
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
    getUpcomingTasks,
    checkEmailBeforeSend,
    cleanupUnverifiedAccounts,
};
