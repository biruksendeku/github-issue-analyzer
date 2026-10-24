import User from "../models/user.js";
import Result from "../models/result.js";
import fetchLatestRepo from "../utils/fetchLatestRepo.js";

// save the username input and record last repo here
const saveUsername = async (id, username) => {
  // find the latest repo
  const latestRepo = await fetchLatestRepo(username);
  const newResult = new Result({
    user: userId,
    latestRepo,
  });
  await newResult.save();
  // const newUser = await User.repoUsernames.push({ username });
  await User.findById(
    id, // user identifier ID, passed to the saveUsername function in the controller
    {
      $push: {
        repoUsernames: {
          username, // the addedAt date will be handlled by the schema
        },
      },
    },
    { new: true, runValidators: true },
  );
};

export default saveUsername;
