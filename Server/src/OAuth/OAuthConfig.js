const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAdvancedPassword,
  generateToken,
} = require("../Tools/GeneratePassword");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          const placeholderPassword = generateAdvancedPassword();

          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(
            placeholderPassword,
            saltRounds
          );

          user = new User({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword,
            authProvider: "google",
            role: "user",
          });

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
