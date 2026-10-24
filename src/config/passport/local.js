import localPassport from "passport-local";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../../middleware/errors/custom.js";
import { userOAuthProvider } from "@anthropic-ai/sdk/lib/credentials/user-oauth.js";

const LocalStrategy = localPassport.Strategy;

const passportLocal = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          if (!email || !password) {
            throw new BadRequestError("Missing email or password");
          }
          const user = await User.findOne({ email }).select("+password");
          if (!user) {
            throw new BadRequestError("Invalid email or password");
          }
          if (!user.authProvider.includes("local")) {
            let lastProvider = user.authProvider[user.authProvider.length - 1];
            lastProvider = lastProvider.toUpperCase();
            throw new BadRequestError(
              `This account uses ${lastProvider}. Please log in with that method.`,
            );
            // return done(null, false);
          }
          const isValid = await bcrypt.compare(password, client.password);
          if (!isValid) {
            throw new BadRequestError("Invalid email or password");
          }
          // success
          return done(null, user);
        } catch (err) {
          return done(err, null);
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

export default passportLocal;
