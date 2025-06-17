const cron = require("node-cron");
const { sendNotification } = require("../sockets/socketManager");
const { getTasksDueSoon } = require("../util/functions");

// Gửi thông báo qua socket cho người dùng về các task và subtask quá hạn hoặc sắp đến hạn
cron.schedule("*/15 * * * *", async () => {
    const userTasksMap = await getTasksDueSoon();

    for (const userId of Object.keys(userTasksMap)) {
        const userTasks = userTasksMap[userId];

        for (const n of userTasks.notifications) {
            sendNotification(userId, {
                taskId: n.taskId,
                taskName: n.taskName,
                endDate: n.endDate,
                message: n.message,
            });
        }
    }
});
