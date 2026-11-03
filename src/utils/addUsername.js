import mongoose from "mongoose";
import fetchLatestIssue from "./fetchLatestIssue.js";
import Result from "../models/result.js";
import User from "../models/user.js";
import { NotFoundError } from "../middleware/errors/custom.js";

const addUsername = async (id, username, repo) => {
  const response = await fetchLatestIssue(username, repo);
  if (!response) throw new NotFoundError(`${username}-${repo}`);

  const pureIssues = response.filter((issues) => !issues.pull_request);
  const latestIssue = pureIssues[0];
  console.log("latestIssue: ", latestIssue);

  const session = await mongoose.startSession();
  try {
    let newResult, updatedUser;

    await session.withTransaction(async () => {
      [newResult] = await Result.create(
        [{ user: id, latestIssue: latestIssue.full_name }],
        { session },
      );

      updatedUser = await User.findByIdAndUpdate(
        id,
        { $addToSet: { usernamesAndRepo: { username, repo } } },
        { new: true, runValidators: true, session },
      );

      if (!updatedUser) throw new NotFoundError("User"); // abort tx
    });

    return { newResult, updatedUser };
  } finally {
    await session.endSession();
  }
};

export default addUsername;
