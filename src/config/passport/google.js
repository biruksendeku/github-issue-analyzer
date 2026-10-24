const GoogleStrategy = require("passport-google-oauth20");
import User from "../../models/user.js";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

const passportGoogle = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        profileFields: ["email", "displayName", "id", "avatar"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0]?.value;
          const user = await User.findOne({ email });
          if (user) {
            if (!user.authProvider.includes("google")) {
              user.googleId = profile.id;
              // also verify if unverified email
              if (!user.emailVerified) {
                user.emailVerified = true;
                user.emailVerifiedAt = new Date();
              }
              user.authProvider.push("google");
              await user.save();
              return done(null, user);
            } else {
              // already uses google
              return done(null, user);
            }
          }
          const newUser = new User({
            name: profile.displayName
              ? profile.displayName
              : `GoogleUser-${new Date()}`,
            email,
            googleId: profile.id,
            avatar: profile.photos ? profile.photos[0]?.value : null,
            emailVerified: true,
            emailVerifiedAt: new Date(),
          });
          newUser.authProvider.push("google");
          await newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err, null);
        }
      },
    ),
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default passportGoogle;
