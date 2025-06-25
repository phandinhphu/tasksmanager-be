const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = require("../models/User");
const {
    sendVerificationEmail,
    sendResetPasswordEmail,
} = require("../../util/sendEmail");
const {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    FRONTEND_URL,
} = require("../../util/constants");

class AuthController {
    // [POST] /auth/register
    async register(req, res, next) {
        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = await userSchema.findOne({ email });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Email already exists" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Generate verification token
            const verifyToken = crypto.randomBytes(32).toString("hex");

            // Create a new user
            const newUser = new userSchema({
                name,
                email,
                password: hashedPassword,
                verifyToken,
            });

            // Send verification email
            await sendVerificationEmail(email, verifyToken);

            await newUser.save();
            return res.status(201).json({
                message:
                    "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản của bạn nếu không tài khoản sẽ tự động bị xóa sau 24 giờ.",
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [POST] /auth/login
    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            // Check if user exists
            const user = await userSchema.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Email hoặc mật khẩu không hợp lệ" });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res
                    .status(400)
                    .json({ message: "Email hoặc mật khẩu không hợp lệ" });
            }

            // Check if user is verified
            if (!user.verified) {
                return res.status(400).json({
                    message:
                        "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản của bạn.",
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: user._id,
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.cookie("token", token, {
                httpOnly: true, // Không cho JS truy cập
                secure: true, // bắt buộc khi sameSite: 'None'
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });

            res.json({ message: "Đăng nhập thành công" });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [POST] /auth/logout
    async logout(req, res, next) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                path: "/",
            });
            return res.status(200).json({ message: "Đăng xuất thành công" });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [GET] /auth/verify-email
    async verifyEmail(req, res, next) {
        const { token } = req.query;

        try {
            // Find user by verification token
            const user = await userSchema.findOne({ verifyToken: token });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
            }

            // Update user to verified
            user.verified = true;
            user.verifyToken = null; // Clear the verification token
            await user.save();

            return res.redirect(`${FRONTEND_URL}/verify-success`);
        } catch (error) {
            return res.redirect(`${FRONTEND_URL}/verify-fail`);
        }
    }

    // [POST] /auth/forgot-password
    async forgotPassword(req, res, next) {
        const { email } = req.body;

        try {
            // Find user by email
            const user = await userSchema.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Email không tồn tại" });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString("hex");
            user.forgotPasswordToken = resetToken;
            await user.save();

            // Send reset password email
            await sendResetPasswordEmail(email, resetToken);

            return res.status(200).json({
                message: "Vui lòng kiểm tra email để đặt lại mật khẩu của bạn.",
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [POST] /auth/reset-password
    async resetPassword(req, res, next) {
        const { token, newPassword } = req.body;

        try {
            // Find user by reset token
            const user = await userSchema.findOne({
                forgotPasswordToken: token,
            });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update user's password and clear reset token
            user.password = hashedPassword;
            user.forgotPasswordToken = null;

            await user.save();

            return res.status(200).json({
                message:
                    "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.",
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }
}

module.exports = new AuthController();
