const cron = require("node-cron");
const { sendEmail } = require("../util/sendEmail");
const { getTasksDueSoon, checkEmailBeforeSend } = require("../util/functions");

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
