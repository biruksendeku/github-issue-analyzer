import { Worker } from "bullmq";
import fetchRepos from "../utils/fetchRepos.js";
import connection from "../config/redis.js";

const worker = new Worker(
  "fetch-repos",
  async (job) => {
    const { username } = job.data;
    try {
      const latestRepo = await fetchRepos(username);
      return latestRepo;
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  },
  {
    connection,
    concurrency: 1, // Limit to one job at a time
  },
);

// fetchReposQueue().catch((err) => {
//   console.error("Error adding job to fetchReposQueue:", err);
// });

worker.on("failed", (job, err) => {
  console.error("Worker failed:", job?.id, err.message);
});

console.log("fetchRepos worker is running and listening for jobs...");
export default worker;
