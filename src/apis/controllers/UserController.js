const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class UserController {
  // [GET] /users/me
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại sau!' });
    }
  }

  // [PUT] /users/me/avatar
  async updateAvatar(req, res) {
    try {
      const userId = req.user.id;
      
      if (!req.files || !req.files.avatar) {
        return res.status(400).json({ message: 'Không có file avatar nào được tải lên' });
      }
      
      const file = req.files.avatar;
      
      // Upload lên Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'user_avatars',
        public_id: `user_${userId}`,
        overwrite: true
      });
      
      // Cập nhật user profile với URL avatar
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: result.secure_url },
        { new: true }
      ).select('-password');
      
      return res.status(200).json({
        message: 'Avatar đã được cập nhật thành công',
        user: updatedUser
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Có lỗi xảy ra khi tải lên avatar' });
    }
  }
}

module.exports = new UserController();