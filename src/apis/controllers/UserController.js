const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/User');

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
}

module.exports = new UserController();