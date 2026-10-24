import User from "../models/user.js";
import Result from "../models/result.js";

// save the username input and record last repo here
const saveUsername = async (username) => {
  await Result.create({
    user: req.user._id,
    repoUsername: username,
  });
};

export default saveUsername;
