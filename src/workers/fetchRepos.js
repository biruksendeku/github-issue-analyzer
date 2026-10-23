import fetchReposQueue from "../queues/fetchRepos";
import { Worker } from "bullmq";
import fetchRepos from "../utils/fetchRepos.js";
import connection from "../config/redis.js";

const worker = new Worker(
  "fetch-repos",
  async (job) => {
    try {
      const latestRepo = await fetchRepos();
      // Process the fetched repository data
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  },
  {
    connection,
    concurrency: 1, // Limit to one job at a time
  },
);

fetchReposQueue().catch((err) => {
  console.error("Error adding job to fetchReposQueue:", err);
});

console.log("fetchRepos worker is running and listening for jobs...");

export default worker;
