import User from "../models/user.js";
import Result from "../models/result.js";
import fetchLatestRepo from "./fetchLatestRepo.js";

// save the username input and record last repo here
const addUsername = async (id, username) => {
  // find the latest repo
  const latestRepo = await fetchLatestRepo(username);
  console.log("Latest repo full_name: ", latestRepo.full_name);
  const newResult = new Result({
    user: id,
    latestRepo: latestRepo.full_name,
  });
  await newResult.save();

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

export default addUsername;
