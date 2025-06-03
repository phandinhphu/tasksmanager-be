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
    completed: false,
  }).populate("userid status");

  tasks.forEach((task) => {
    // Kiểm tra task có subtasks không
    if (task.subtasks && task.subtasks.length > 0) {
      // Kiểm tra nếu có subtask quá hạn hoặc sắp đến hạn thì gửi thông báo
      const hasOverdueSubtask = task.subtasks.filter((subtask) => {
        const subStart = new Date(subtask.start_date);
        const subEnd = subtask?.extend_date
          ? new Date(subtask.extend_date)
          : new Date(subtask.end_date);

        return (
          (subEnd < now || (subEnd >= now && subEnd <= threeDaysLater)) &&
          subStart <= now
        );
      });

      if (hasOverdueSubtask.length > 0) {
        // Gửi thông báo cho từng subtask quá hạn hoặc sắp đến hạn
        hasOverdueSubtask.forEach((subtask) => {
          const subEnd = subtask?.extend_date
            ? new Date(subtask.extend_date)
            : new Date(subtask.end_date);

          const message =
            subEnd < now
              ? `Subtask "${subtask.task_name}" đã quá hạn!`
              : `Subtask "${subtask.task_name}" sắp đến hạn trong 3 ngày.`;

          sendNotification(task.userid._id.toString(), {
            taskId: task._id,
            taskName: task.task_name,
            endDate: subEnd,
            message,
          });
        });
      }
    }

    const taskStart = new Date(task.start_date);
    const taskEnd = task?.extend_date
      ? new Date(task.extend_date)
      : new Date(task.end_date);

    if (
      (taskEnd < now || (taskEnd >= now && taskEnd <= threeDaysLater)) &&
      taskStart <= now
    ) {
      // Gửi thông báo nếu task quá hạn hoặc sắp đến hạn
      const message =
        taskEnd < now
          ? `Task "${task.task_name}" đã quá hạn!`
          : `Task "${task.task_name}" sắp đến hạn trong 3 ngày.`;

      sendNotification(task.userid._id.toString(), {
        taskId: task._id,
        taskName: task.task_name,
        endDate: taskEnd,
        message,
      });
    }
  });
});

module.exports = {}; // để import chạy cron
