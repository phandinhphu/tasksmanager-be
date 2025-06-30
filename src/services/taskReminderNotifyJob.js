const cron = require("node-cron");
const { sendNotification } = require("../sockets/socketManager");
const { getTasksDueSoon, getUpcomingTasks } = require("../util/functions");

// Gửi thông báo qua socket cho người dùng về các task và subtask quá hạn hoặc sắp đến hạn
cron.schedule(
    "*/15 * * * *",
    async () => {
        const tasksDueSoon = await getTasksDueSoon();
        const upcomingTasks = await getUpcomingTasks();

        // Gửi thông báo cho các task quá hạn hoặc sắp đến hạn
        for (const userId of Object.keys(tasksDueSoon)) {
            const userTasks = tasksDueSoon[userId];

            for (const n of userTasks.notifications) {
                sendNotification(userId, {
                    taskId: n.taskId,
                    taskName: n.taskName,
                    endDate: n.endDate,
                    message: n.message,
                });
            }
        }

        // Gửi thông báo cho các task sắp đến hạn trong 3 ngày
        for (const userId of Object.keys(upcomingTasks)) {
            const userTasks = upcomingTasks[userId];

            for (const n of userTasks.notifications) {
                sendNotification(userId, {
                    taskId: n.taskId,
                    taskName: n.taskName,
                    endDate: n.endDate,
                    message: n.message,
                });
            }
        }
    },
    {
        timezone: "Asia/Ho_Chi_Minh",
    }
);
