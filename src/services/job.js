// File này dùng để chạy các cron job định kỳ không cần người dùng truy cập vào hệ thống

require("./taskReminderSendMailJob");
require("./taskReminderNotifyJob");
require("./cleanupUnverifiedAccountsDailyJob");
