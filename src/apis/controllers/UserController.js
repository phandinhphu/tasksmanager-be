const bcrypt = require("bcryptjs");
const userSchema = require("../models/User");
const cloudinary = require("../../config/cloudinary");

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
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
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
        const uploadResponse = await cloudinary.uploader.upload(avatar, {
          folder: "avatars",
          public_id: user.avatar_id,
          overwrite: true,
        });

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

      return res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra. Vui lòng thử lại sau!!!" });
    }
  }
}

module.exports = new UserController();
