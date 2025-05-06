const userSchema = require('../models/User');

class AuthController {
    // [POST] /auth/register
    register(req, res, next) {
        console.log(req.body);

        const user = new userSchema(req.body);
        user.save()
            .then(() => {
                return res.status(201).json({ message: 'User registered successfully' });
            })
            .catch(err => {
                return res.status(500).json({ message: `Internal server error ${err}` });
            });
    }

    // [POST] /auth/login
    login(req, res, next) {
        const { email, password } = req.body;
        userSchema.findOne({ email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                if (user.password !== password) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                // Here you would typically create a session or a token
                return res.status(200).json(user);
            })
            .catch(err => {
                return res.status(500).json({ message: 'Internal server error' });
            });
    }
}

module.exports = new AuthController();