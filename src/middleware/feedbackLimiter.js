const rateLimit = require("express-rate-limit");

const feedbackLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Tối đa 5 yêu cầu trong 1 giờ
    message: "Quá nhiều yêu cầu phản hồi từ IP này, vui lòng thử lại sau.",
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = feedbackLimiter;
