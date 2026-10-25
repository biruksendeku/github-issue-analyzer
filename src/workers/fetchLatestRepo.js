import { Worker } from "bullmq";
import fetchLatestRepo from "../utils/fetchLatestRepo.js";
import connection from "../config/redis.js";

const worker = new Worker(
  "fetch-repos",
  async (job) => {
    const { username } = job.data;
    console.log("job.data: ", job.data);
    try {
      const latestRepo = await fetchLatestRepo(username);
      console.log(`Latest-repo for ${username}: `, latestRepo);
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
