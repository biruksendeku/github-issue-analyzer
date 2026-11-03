import { Queue } from "bullmq";
import connection from "../config/redis.js";
const { JOB_NAME } = process.env;

const fetchIssuesQueue = new Queue(JOB_NAME, {
  connection,
});

// await fetchIssuesQueue.add(JOB_NAME, {
//   repeat: { pattern: "0 */3 * * *" }, // every 3 hours
//   jobId: "fetch-repos-3h", // prevents duplicate schedules
//   removeOnComplete: 100,
//   removeOnFail: 500,
// });

await fetchIssuesQueue.add(JOB_NAME, {
  repeat: { pattern: "*/5 * * * *" }, // every 5 minutes
  jobId: "fetch-repos-5m", // prevents duplicate schedules
  removeOnComplete: 100,
  removeOnFail: 500,
});

export default fetchIssuesQueue;
