import "dotenv/config";
import { Worker } from "bullmq";
import fetchLatestIssue, {
  createIssueSnapshot,
  getLatestOpenIssue,
} from "../utils/fetchLatestIssue.js";
import connectDb from "../utils/connectDb.js";
import connection from "../config/redis.js";
import User from "../models/user.js";

const { JOB_NAME } = process.env;

if (!JOB_NAME) {
  throw new Error("JOB_NAME is not set");
}

await connectDb();

const worker = new Worker(
  JOB_NAME,
  async () => {
    const users = await User.find({
      "usernamesAndRepo.0": { $exists: true },
    })
      .select("_id usernamesAndRepo")
      .lean();

    for (const user of users) {
      for (const trackedRepo of user.usernamesAndRepo) {
        try {
          const issues = await fetchLatestIssue(
            trackedRepo.username,
            trackedRepo.repo,
          );
          const latestIssue = getLatestOpenIssue(issues);

          if (!latestIssue) continue;

          const latestIssueSnapshot = createIssueSnapshot(latestIssue);
          const update = {
            "usernamesAndRepo.$[trackedRepo].latestIssue": latestIssueSnapshot,
          };

          if (!trackedRepo.latestIssue) {
            console.log(
              `Initialized issue baseline for ${trackedRepo.username}/${trackedRepo.repo}: #${latestIssue.number}`,
            );
          } else if (latestIssue.number > trackedRepo.latestIssue.number) {
            update[
              "usernamesAndRepo.$[trackedRepo].lastNewIssue"
            ] = {
              ...latestIssueSnapshot,
              detectedAt: new Date(),
            };
            console.log(
              `New open issue detected for ${trackedRepo.username}/${trackedRepo.repo}: #${latestIssue.number} ${latestIssue.html_url}`,
            );
          } else {
            continue;
          }

          await User.updateOne(
            { _id: user._id },
            { $set: update },
            {
              arrayFilters: [
                {
                  "trackedRepo.username": trackedRepo.username,
                  "trackedRepo.repo": trackedRepo.repo,
                },
              ],
            },
          );
        } catch (error) {
          console.error(
            `Error checking ${trackedRepo.username}/${trackedRepo.repo}:`,
            error,
          );
        }
      }
    }
  },
  {
    connection,
    concurrency: 1,
  },
);

worker.on("failed", (job, err) => {
  console.error("Worker failed:", job?.id, err.message);
});

console.log("Issue monitoring worker is running and listening for jobs...");

export default worker;
