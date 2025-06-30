const cron = require("node-cron");
const { sendEmail } = require("../util/sendEmail");
const {
    getTasksDueSoon,
    getUpcomingTasks,
    checkEmailBeforeSend,
} = require("../util/functions");
const { FRONTEND_URL } = require("../util/constants");

// Gửi email cho người dùng về các task và subtask quá hạn hoặc sắp đến hạn
cron.schedule(
    "0 8,13,18 * * *",
    async () => {
        const tasksDueSoon = await getTasksDueSoon();

        Object.values(tasksDueSoon).forEach(async (userTasks) => {
            if (userTasks.emails.length > 0) {
                const subject = `Thông báo công việc của bạn - ${new Date().toLocaleDateString()}`;
                const emailContent = `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
                    <p>Xin chào <strong>${userTasks.name}</strong>,</p>

                    <p>Bạn có các công việc sau cần chú ý:</p>

                    <ul style="padding-left: 20px; margin: 0;">
                        ${userTasks.emails
                            .map((msg) => `<li>${msg}</li>`)
                            .join("\n")}
                    </ul>

                    <p>Vui lòng <a href="${FRONTEND_URL}" style="color: #1a73e8; text-decoration: none;">đăng nhập hệ thống</a> để xem chi tiết.</p>

                    <p style="margin-top: 20px;">Trân trọng,<br/>
                    <strong>Hệ thống Quản lý Công việc</strong></p>
                </div>
            `;

                const isSend = await checkEmailBeforeSend({
                    to: userTasks.email,
                    subject: subject,
                    text: emailContent,
                });

                if (isSend) {
                    await sendEmail(userTasks.email, subject, emailContent);
                }
            }
        });

        const upcomingTasks = await getUpcomingTasks();

        Object.values(upcomingTasks).forEach(async (userTasks) => {
            if (userTasks.emails.length > 0) {
                const subject = `Thông báo công việc sắp tới của bạn - ${new Date().toLocaleDateString()}`;
                const emailContent = `
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
                    <p>Xin chào <strong>${userTasks.name}</strong>,</p>

                    <p>Bạn có các công việc sắp tới:</p>

                    <ul style="padding-left: 20px; margin: 0;">
                        ${userTasks.emails
                            .map((msg) => `<li>${msg}</li>`)
                            .join("\n")}
                    </ul>

                    <p>Vui lòng <a href="${FRONTEND_URL}" style="color: #1a73e8; text-decoration: none;">đăng nhập hệ thống</a> để xem chi tiết.</p>

                    <p style="margin-top: 20px;">Trân trọng,<br/>
                    <strong>Hệ thống Quản lý Công việc</strong></p>
                </div>
            `;

                const isSend = await checkEmailBeforeSend({
                    to: userTasks.email,
                    subject: subject,
                    text: emailContent,
                });

                if (isSend) {
                    await sendEmail(userTasks.email, subject, emailContent);
                }
            }
        });
    },
    {
        timezone: "Asia/Ho_Chi_Minh",
    }
);
