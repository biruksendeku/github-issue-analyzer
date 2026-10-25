const isAuthenticated = async (req, res, next) => {
  // check authentication
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  // ensure user data exists
  if (!req.user) {
    return res.status(500).json({
      success: false,
      message: "User data not found. Please log in again.",
    });
  }

  // all good
  if (req.user.emailVerified === true) {
    return next();
  }
  // unauthorized access
  res.redirect("/auth/login");
};

// TODO: just for resend endpoint not to ask email again - later opts
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  next();
};

// role based access for admin
const isAdmin = async (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  res.status(403).send("Forbidden");
};

export { isAuthenticated, isLoggedIn, isAdmin };
