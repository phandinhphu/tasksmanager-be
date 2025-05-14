const cron = require("node-cron");
const Task = require("../apis/models/Task");
const Status = require("../apis/models/Status");
const { sendNotification } = require("./../sockets/socketManager");

cron.schedule("*/15 * * * *", async () => {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + 3);

    // Lấy statusId của "In Progress"
    const status = await Status.findOne({ name: "In Progress" });
    if (!status) return;
    
    const tasks = await Task.find({
        status: status._id,
        end_date: { $lte: threeDaysLater },
        completed: false
    }).populate("userid status");
    console.log("tasks", tasks);
    tasks.forEach(task => {
        const message = task.end_date < now
            ? `Task "${task.task_name}" đã quá hạn!`
            : `Task "${task.task_name}" sắp đến hạn trong 3 ngày.`;

        sendNotification(task.userid._id.toString(), {
            taskId: task._id,
            taskName: task.task_name,
            endDate: task.end_date,
            message
        });
    });
});

module.exports = {}; // để import chạy cron
