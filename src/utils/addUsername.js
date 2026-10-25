import mongoose from "mongoose";
import fetchLatestRepo from "./fetchLatestRepo.js";
import Result from "../models/result.js";
import User from "../models/user.js";
import { NotFoundError } from "../middleware/errors/custom.js";

const addUsername = async (id, username) => {
  const latestRepo = await fetchLatestRepo(username);
  if (!latestRepo) throw new NotFoundError(`${username} repos`);

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

      if (!updatedUser) throw new NotFoundError(`User ${id}`); // abort tx
    });

    return { newResult, updatedUser };
  } finally {
    await session.endSession();
  }
};

export default addUsername;
