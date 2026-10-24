import crypto from "crypto";
import User from "../models/user.js";
import { formatName, getFirstName } from "../utils/formatName.js";
import { hashPassword } from "../utils/authHelper.js";
import promisify from "../utils/promisify.js";
import { BadRequestError } from "../middleware/errors/custom.js";

const createAccountGet = (req, res) => {
  res.status(200).render("signup");
};

const createAccount = async (req, res) => {
  let { firstName, lastName, email, password, confirmPassword } = req.body;
  // validate inputs
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new BadRequestError("All fields are required");
  }
  if (password !== confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }
  const user = await User.findOne({ email }).select("+password");
  // existing client with local auth
  if (user && user.authProvider.includes("local")) {
    throw new BadRequestError("Account already exists. Please log in.");
  }
  // existing user from OAuth - add password
  if (user) {
    const hash = await hashPassword(password);
    user.password = hash;
    user.authProvider.push("local");
    await user.save();
    await promisify((cb) => req.login(client, cb));
    return res.redirect("/");
  }
  // new user
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const hash = await hashPassword(password);
  // saving user on db
  const newUser = new User({
    name: `${formatName(firstName)} ${formatName(lastName)}`,
    email,
    password: hash,
    planExpiresAt,
    verificationToken,
    verificationExpiresAt,
  });
  newUser.authProvider.push("local");
  await newUser.save();
  // log them in immediately
  await promisify((cb) => req.login(newUser, cb));
  // queue verification email
  const job = await addVerificationMail(email, firstName, verificationToken);
  await m2cDbCreationJob(job);
  // some response
  req.flash("success", "Account created! Check your email to verify.");
  res.redirect("back");
};

export { createAccountGet, createAccount };
