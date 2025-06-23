const dotenv = require("dotenv");
const nodeMailer = require("nodemailer");
const LogEmail = require("../apis/models/LogEmail");

dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: text,
  };
  try {
    const result = transporter.sendMail(mailOptions);

    //write log
    const logEmail = new LogEmail({
      to,
      subject,
      text,
      sentAt: new Date(),
      status: "success",
    });
    await logEmail.save();
    return result;
  } catch (error) {
    //write error log
    const logEmail = new LogEmail({
      to,
      subject,
      text,
      sentAt: new Date(),
      status: "fail",
      error: error.message,
    });
    await logEmail.save();
    throw new Error(`Failed to send email with error: ${error.message}`);
  }
};

const sendVerificationEmail = (to, token) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: ${process.env.BASE_URL}/api/auth/verify-email?token=${token}`,
  };
  // using try catch instead of throw error and dead
  try {
    const result = transporter.sendMail(mailOptions);

    //write log
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
    //write error log
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
      `Failed to send verification email with error: ${error.message}`,
    );
  }
};

const sendResetPasswordEmail = (to, token) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Reset Password",
    text: `You can reset your password by clicking on the following link: ${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  };
  // same above
  try {
    const result = transporter.sendMail(mailOptions);

    //write log
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
    //write error log
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
      `Failed to send password reset email with error: ${error.message}`,
    );
  }
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};
