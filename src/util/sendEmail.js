const nodeMailer = require("nodemailer");
const LogEmail = require("../apis/models/LogEmail");
const {
    GMAIL_USER,
    GMAIL_PASS,
    BASE_URL,
    FRONTEND_URL,
} = require("../util/constants");

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: GMAIL_USER,
        to,
        subject,
        html: text,
    };

    try {
        const result = transporter.sendMail(mailOptions);

        // Gửi thành công, ghi log
        const logEmail = new LogEmail({
            to,
            subject,
            text,
            sentAt: new Date(),
            status: "success",
        });

        logEmail.save();
        return result;
    } catch (error) {
        // Gửi thất bại, ghi log lỗi
        const logEmail = new LogEmail({
            to,
            subject,
            text,
            sentAt: new Date(),
            status: "fail",
            error: error.message,
        });

        logEmail.save();
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

const sendVerificationEmail = (to, token) => {
    const mailOptions = {
        from: GMAIL_USER,
        to,
        subject: "Email Verification",
        text: `Please verify your email by clicking on the following link: ${BASE_URL}/api/auth/verify-email?token=${token}`,
    };

    try {
        const result = transporter.sendMail(mailOptions);

        // Gửi thành công, ghi log
        const logEmail = new LogEmail({
            to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            sentAt: new Date(),
            status: "success",
        });

        logEmail.save();
        return result;
    } catch (error) {
        // Gửi thất bại, ghi log lỗi
        const logEmail = new LogEmail({
            to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            sentAt: new Date(),
            status: "fail",
            error: error.message,
        });

        logEmail.save();
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

const sendResetPasswordEmail = (to, token) => {
    const mailOptions = {
        from: GMAIL_USER,
        to,
        subject: "Reset Password",
        text: `You can reset your password by clicking on the following link: ${FRONTEND_URL}/reset-password?token=${token}`,
    };

    try {
        const result = transporter.sendMail(mailOptions);

        // Gửi thành công, ghi log
        const logEmail = new LogEmail({
            to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            sentAt: new Date(),
            status: "success",
        });

        logEmail.save();
        return result;
    } catch (error) {
        // Gửi thất bại, ghi log lỗi
        const logEmail = new LogEmail({
            to,
            subject: mailOptions.subject,
            text: mailOptions.text,
            sentAt: new Date(),
            status: "fail",
            error: error.message,
        });

        logEmail.save();
        throw new Error(
            `Failed to send reset password email: ${error.message}`
        );
    }
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendResetPasswordEmail,
};
