// passport-config.js
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config(); // Ensure you have a .env file with your credentials

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,         // Set these in your .env file
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        // Here you can integrate with your database (e.g., find or create a user)
        // For now, we'll just pass the GitHub profile through
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
