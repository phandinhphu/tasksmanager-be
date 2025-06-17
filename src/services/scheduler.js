const cron = require("node-cron");
const Task = require("../apis/models/Task");
const LogEmail = require("../apis/models/LogEmail");
const { sendNotification } = require("./../sockets/socketManager");
const { sendEmail } = require("../util/sendEmail");

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

// Gửi thông báo qua socket cho người dùng về các task và subtask quá hạn hoặc sắp đến hạn
cron.schedule("*/15 * * * *", async () => {
    const userTasksMap = await getTasksDueSoon();

    Object.keys(userTasksMap).forEach(async (userId) => {
        const userTasks = userTasksMap[userId];

        // Gửi thông báo qua socket
        userTasks.notifications.forEach((n) => {
            sendNotification(userId, {
                taskId: n.taskId,
                taskName: n.taskName,
                endDate: n.endDate,
                message: n.message,
            });
        });
    });
});

// Gửi email cho người dùng về các task và subtask quá hạn hoặc sắp đến hạn
cron.schedule("0 8,13,18 * * *", async () => {
    const userTasksMap = await getTasksDueSoon();

    Object.values(userTasksMap).forEach(async (userTasks) => {
        if (userTasks.emails.length > 0) {
            const emailContent = `
                Xin chào ${userTasks.name},

                Bạn có các công việc sau cần chú ý:
                ${userTasks.emails
                    .map((msg, i) => `${i + 1}. ${msg}`)
                    .join("\n")}

                Vui lòng đăng nhập hệ thống để xem chi tiết.
            `;

            const isSend = await checkEmailBeforeSend({
                to: userTasks.email,
                subject: "Thông báo công việc của bạn",
                text: emailContent,
            });

            if (isSend) {
                await sendEmail({
                    to: userTasks.email,
                    subject: "Thông báo công việc của bạn",
                    text: emailContent,
                });
            }
        }
    });
});

module.exports = {}; // để import chạy cron
