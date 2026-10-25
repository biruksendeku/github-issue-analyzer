import promisify from "../utils/promisify.js";
import { AppError } from "../middleware/errors/custom.js";

const googleAuth = (passport) => {
  return (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  };
};

const googleAuthCallback = (passport) => {
  return async (req, res, next) => {
    try {
      const authenticate = await promisify((cb) => {
        passport.authenticate("google", (err, user, info) => {
          if (err) return cb(err);
          if (!user)
            return cb(
              new AppError(info?.message || "Authentication failed", 401),
            );
          cb(null, user);
        })(req, res);
      });
      const user = await authenticate;
      await promisify((cb) => req.login(user, cb));
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  };
};

export { googleAuth, googleAuthCallback };
