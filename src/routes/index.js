const authRoutes = require('./auth');

function routes(app) {
    app.use('/auth', authRoutes);
}

module.exports = routes;
