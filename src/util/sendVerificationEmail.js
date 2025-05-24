const nodeMailer = require('nodemailer');

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
        text: `Please verify your email by clicking on the following link: ${process.env.BASE_URL}/auth/verify-email?token=${token}`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
