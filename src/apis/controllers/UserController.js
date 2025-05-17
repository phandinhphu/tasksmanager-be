const bcrypt = require('bcryptjs');
const userSchema = require('../models/User');
const cloudinary = require('cloudinary').v2;
const { cloud_name, api_key, api_secret } = require('../../config/cloudinary');

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});

class UserController {
    // [GET] /user/me
    async getMe(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Có lôĩ xảy ra. Vui lòng thử lại sao!!!' });
        }
    }    

    // [POST] user/update-profile
    async updateProfile(req, res, next) {
        try {
            const { name, password, avatar, avatar_id } = req.body;
            const userId = req.user._id;

            // Check if the user exists
            const user = await userSchema.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user have old avatar
            if (user.avatar_id !== "default-avatar" && avatar && user.avatar) {
                // Delete the old avatar from Cloudinary
                await cloudinary.uploader.destroy(user.avatar_id);
            }

            // Update the user's profile
            user.name = name || user.name;
            user.password = password ? await bcrypt.hash(password, 10) : user.password;
            user.avatar = avatar || user.avatar;
            user.avatar_id = avatar_id || user.avatar_id;

            // Save the updated user
            await user.save();

            return res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (error) {
            return res.status(500).json({ message: 'Có lôĩ xảy ra. Vui lòng thử lại sao!!!' });
        }
    }
}

module.exports = new UserController();