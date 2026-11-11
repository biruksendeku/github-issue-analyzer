import mongoose from "mongoose";
import fetchLatestIssue, {
  createIssueSnapshot,
  getLatestOpenIssue,
} from "./fetchLatestIssue.js";
import Result from "../models/result.js";
import User from "../models/user.js";
import { NotFoundError } from "../middleware/errors/custom.js";

const addRepo = async (id, username, repo) => {
  username = username.trim().toLowerCase();
  repo = repo.trim().toLowerCase();
  const response = await fetchLatestIssue(username, repo);
  if (!response) throw new NotFoundError(`${username}-${repo}`);

  const latestIssue = getLatestOpenIssue(response);
  const latestIssueSnapshot = createIssueSnapshot(latestIssue);

  const session = await mongoose.startSession();
  try {
    let newResult, updatedUser;

    await session.withTransaction(async () => {
      [newResult] = await Result.create(
        [{ user: id, latestIssue: latestIssueSnapshot?.htmlUrl }],
        { session },
      );

      const repoSelector = {
        _id: id,
        usernamesAndRepo: { $elemMatch: { username, repo } },
      };
      const existingRepo = await User.exists(repoSelector).session(session);

      if (existingRepo) {
        updatedUser = await User.findOneAndUpdate(
          repoSelector,
          { $set: { "usernamesAndRepo.$.latestIssue": latestIssueSnapshot } },
          { new: true, runValidators: true, session },
        );
      } else {
        updatedUser = await User.findByIdAndUpdate(
          id,
          {
            $push: {
              usernamesAndRepo: {
                username,
                repo,
                latestIssue: latestIssueSnapshot,
              },
            },
          },
          { new: true, runValidators: true, session },
        );
      }

      if (!updatedUser) throw new NotFoundError("User"); // abort tx
    });

    return { newResult, updatedUser };
  } finally {
    await session.endSession();
  }
};

export default addRepo;
