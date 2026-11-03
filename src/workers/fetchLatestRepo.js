import { Worker } from "bullmq";
import mongoose from "mongoose";
import fetchLatestIssue from "../utils/fetchLatestIssue.js";
import connection from "../config/redis.js";
import User from "../models/user.js";
import { NotFoundError } from "../middleware/errors/custom.js";

const worker = new Worker(
  "fetch-repos",
  async (job) => {
    const { username } = job.data;
    console.log("job.data's username: ", username);
    console.log("job.data: ", job.data);
    const [result] = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$usernamesAndRepo" },
      { $sort: { "usernamesAndRepo.addedAt": -1 } },
      {
        $group: {
          _id: "$_id",
          usernamesAndRepo: { $push: "$usernamesAndRepo" },
        },
      },
    ]);
    if (!result) {
      const exists = await User.exists({ _id: id });
      if (!exists) {
        throw new NotFoundError("User");
      }
      return res.json([]); // user exists, just no saved repo-usernames
    }
    try {
      const values = await Promise.all(
        result.usernamesAndRepo.map(async (u) => ({
          username: u.username,
          repo: u.repo,
          data: await fetchLatestIssue(u.username, u.repo),
        })),
      );
      console.log("values: ", values);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  },
  {
    connection,
    concurrency: 1, // Limit to one job at a time
  },
);

worker.on("failed", (job, err) => {
  console.error("Worker failed:", job?.id, err.message);
});

console.log("fetchRepos worker is running and listening for jobs...");
export default worker;
