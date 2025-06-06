const dotenv = require('dotenv');
const nodeMailer = require('nodemailer');

dotenv.config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendVerificationEmail = (to, token) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: ${process.env.BASE_URL}/api/auth/verify-email?token=${token}`,
    };

    return transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = (to, token) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Reset Password',
        text: `You can reset your password by clicking on the following link: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail,
};