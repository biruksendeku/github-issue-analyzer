import fetchReposQueue from "../queues/fetchRepos";
import { Worker } from "bullmq";
import fetchRepos from "../utils/fetchRepos.js";

const worker = new Worker("fetch-repos", async (job) => {
  try {
    const latestRepo = await fetchRepos();
    // Process the fetched repository data
  } catch (error) {
    console.error("Error fetching repositories:", error);
  }
});