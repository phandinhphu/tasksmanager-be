// config/passport.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../apis/models/User");
const dotenv = require('dotenv');

dotenv.config();

module.exports = (passport) => {
    // GOOGLE STRATEGY
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                let user = await User.findOne({ email });

                if (user) {
                    if (!user.googleId) user.googleId = profile.id;
                    user.verified = true;
                    await user.save();
                } else {
                    user = await User.create({
                        email,
                        name,
                        googleId: profile.id,
                        verified: true,
                    });
                }

                return done(null, user);
            }
        )
    );

    // FACEBOOK STRATEGY
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FB_APP_ID,
                clientSecret: process.env.FB_APP_SECRET,
                callbackURL: process.env.FB_CALLBACK_URL,
                profileFields: ["id", "emails", "name", "displayName"],
            },
            async (accessToken, refreshToken, profile, done) => {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                let user = await User.findOne({ email });

                if (user) {
                    if (!user.facebookId) user.facebookId = profile.id;
                    user.verified = true;
                    await user.save();
                } else {
                    user = await User.create({
                        email,
                        name,
                        facebookId: profile.id,
                        verified: true,
                    });
                }

                return done(null, user);
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};
