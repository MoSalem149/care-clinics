const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateAdvancedPassword } = require("../Tools/GeneratePassword");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_REDIRECT_URI,
      profileFields: ["id", "displayName", "emails"],
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
            authProvider: "facebook",
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
