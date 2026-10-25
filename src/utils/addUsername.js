// import User from "../models/user.js";
// import Result from "../models/result.js";
// import fetchLatestRepo from "./fetchLatestRepo.js";

// // save the username input and record last repo here
// const addUsername = async (id, username) => {
//   // find the latest repo
//   const latestRepo = await fetchLatestRepo(username);
//   console.log("Latest repo full_name: ", latestRepo.full_name);
//   const newResult = new Result({
//     user: id,
//     latestRepo: latestRepo.full_name,
//   });
//   await newResult.save();

//   await User.findByIdAndUpdate(
//     id, // user identifier ID, passed to the saveUsername function in the controller
//     {
//       $push: {
//         repoUsernames: {
//           username, // the addedAt date will be handlled by the schema
//         },
//       },
//     },
//     { new: true, runValidators: true },
//   );

//   Promise.race([fetchLatestRepo(username), ])
// };

// export default addUsername;

import mongoose from "mongoose";

const addUsername = async (id, username) => {
  const latestRepo = await fetchLatestRepo(username);
  if (!latestRepo) throw new Error(`No repos found for ${username}`);

  const session = await mongoose.startSession();
  try {
    let newResult, updatedUser;

    await session.withTransaction(async () => {
      [newResult] = await Result.create(
        [{ user: id, latestRepo: latestRepo.full_name }],
        { session },
      );

      updatedUser = await User.findByIdAndUpdate(
        id,
        { $push: { repoUsernames: { username } } },
        { new: true, runValidators: true, session },
      );

      if (!updatedUser) throw new Error(`User ${id} not found`); // abort tx
    });

    return { newResult, updatedUser };
  } finally {
    await session.endSession();
  }
};

export default addUsername;
