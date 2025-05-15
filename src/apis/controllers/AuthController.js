const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userSchema = require('../models/User');

dotenv.config();

class AuthController {
    // [POST] /auth/register
    async register(req, res, next) {
        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = await userSchema.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new userSchema({
                name,
                email,
                password: hashedPassword,
            });

            await newUser.save();
            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Something error, please try again!' });
        }
    }

    // [POST] /auth/login
    async login(req, res, next) {
        const { email, password } = req.body;
        
        try {
            // Check if user exists
            const user = await userSchema.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            
            // Generate JWT token
            const token = jwt.sign({ 
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // Return user info (without password) along with token
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt
            };

            return res.status(200).json({ 
                token,
                user: userResponse
            });
        } catch (error) {
            return res.status(500).json({ message: 'Có lôĩ xảy ra. Vui lòng thử lại sao!!!' });
        }
    }
}

module.exports = new AuthController();