import Queue from "bullmq";
import connection from "../config/redis.js";

const queue = new Queue("api-requests", {
  connection,
});

await queue.add(
  "fetch-api",
  { url: "https://api.example.com" },
  {
    repeat: { pattern: "0 */3 * * *" }, // every 3 hours
    jobId: "fetch-api-3h", // prevents duplicate schedules
    removeOnComplete: 100,
    removeOnFail: 500,
  },
);
