const cron = require("node-cron");
const { sendEmail } = require("../util/sendEmail");
const { cleanupUnverifiedAccounts } = require("../util/functions");

// Dọn dẹp tài khoản chưa xác thực sau 24h
cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const result = await cleanupUnverifiedAccounts();
      if (result && result.length > 0) {
        const subject = "Thông báo dọn dẹp tài khoản chưa xác thực";
        const emailContent = `
                    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
                        <p>Xin chào,</p>
                        <p>Hệ thống đã tự động dọn dẹp các tài khoản chưa xác thực sau 24 giờ.</p>
                        <p>Các tài khoản sau đã bị xóa (<strong>${
                          result.length
                        }</strong>):</p>
                        <ul>
                            ${result
                              .map(
                                (user) =>
                                  `<li>Id: ${user._id} | Email: ${user.email} | Username: ${user.username}</li>`,
                              )
                              .join("")}
                        </ul>
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                        <p>Trân trọng,<br/>
                        <strong>Hệ thống Quản lý Công việc và lịch học cá nhân</strong></p>
                    </div>
                `;
        await sendEmail(process.env.ADMIN_EMAIL, subject, emailContent);
      }
    } catch (error) {
      console.error("Error during cleanup unverified accounts job:", error);
    }
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  },
);
