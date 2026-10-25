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
