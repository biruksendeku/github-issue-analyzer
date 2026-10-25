import promisify from "../utils/promisify.js";

const loginGet = (req, res) => {
  // pass flash messages to the view
  res.render("login");
};

const login = (passport) => {
  return async (req, res, next) => {
    const authenticate = promisify((cb) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return cb(err);
        if (!user) return cb(null, false, info); // pass info
        cb(null, user);
      })(req, res);
    });
    try {
      const user = await authenticate;
      if (!user) {
        // flash messages are already set in the strategy
        return res.redirect("/auth/login");
      }
      await promisify((cb) => req.login(user, cb));
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  };
};

const logout = async (req, res) => {
  await promisify((cb) => req.logout(cb));
  req.session.destroy((err) => {
    res.redirect("/auth/login");
  });
};

export { loginGet, login, logout };
