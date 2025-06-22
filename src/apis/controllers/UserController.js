const bcrypt = require("bcryptjs");
const axios = require("axios");
const userSchema = require("../models/User");
const taskSchema = require("../models/Task");
const cloudinary = require("../../config/cloudinary");
const { sendEmail } = require("../../util/sendEmail");

class UserController {
    // [GET] /user/me
    async getMe(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [POST] user/me/update-profile
    async updateProfile(req, res, next) {
        try {
            const { name, password, avatar } = req.body;
            const userId = req.user._id;

            // Check if the user exists
            const user = await userSchema.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Overwrite the avatar if provided
            if (avatar) {
                // Upload the new avatar to Cloudinary
                const uploadResponse = await cloudinary.uploader.upload(
                    avatar,
                    {
                        folder: "avatars",
                        public_id: user.avatar_id,
                        overwrite: true,
                    }
                );

                // Update the user's avatar and avatar_id
                user.avatar = uploadResponse.secure_url;
                user.avatar_id = uploadResponse.public_id;
            }

            // Update the user's profile
            user.name = name || user.name;
            user.password = password
                ? await bcrypt.hash(password, 10)
                : user.password;

            // Save the updated user
            await user.save();

            const updatedUser = await userSchema
                .findById(userId)
                .select("-password -__v");

            return res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [DELETE] user/me/delete-account
    async deleteAccount(req, res, next) {
        try {
            const userId = req.user._id;

            // Check if the user exists
            const user = await userSchema.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Delete the user's avatar from Cloudinary
            if (user.avatar_id) {
                await cloudinary.uploader.destroy(user.avatar_id);
            }

            // Delete tasks associated with the user
            await taskSchema.deleteMany({ userid: userId });

            // Delete the user account
            await userSchema.findByIdAndDelete(userId);

            // Clear cookies
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                path: "/",
            });

            return res
                .status(200)
                .json({ message: "Account deleted successfully" });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }

    // [POST] user/me/feedback
    async sendFeedback(req, res, next) {
        const { feedback, captchaToken } = req.body;
        const emailAdmin =
            process.env.EMAIL_ADMIN || "phuphandinh2004@gmail.com";
        const name = req.user.name;
        const email = req.user.email;

        try {
            const verifyRes = await axios.post(
                "https://www.google.com/recaptcha/api/siteverify",
                null,
                {
                    params: {
                        secret: process.env.RECAPTCHA_SECRET_KEY,
                        response: captchaToken,
                    },
                }
            );

            const { success, score } = verifyRes.data;

            if (!success || score < 0.5) {
                return res
                    .status(400)
                    .json({ message: "Xác thực reCAPTCHA không thành công" });
            }

            await sendEmail(
                emailAdmin,
                `Feedback from ${name} (${email})`,
                feedback
            );
            return res
                .status(200)
                .json({ message: "Feedback sent successfully" });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Có lôĩ xảy ra. Vui lòng thử lại sao!!!" });
        }
    }
}

module.exports = new UserController();
