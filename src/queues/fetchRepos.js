// import { Queue } from "bullmq";
// import connection from "../config/redis.js";

// const fetchReposQueue = new Queue("fetch-repos", {
//   connection,
// });

// await fetchReposQueue.add("fetch-repos", {
//   repeat: { pattern: "0 */3 * * *" }, // every 3 hours
//   jobId: "fetch-repos-3h", // prevents duplicate schedules
//   removeOnComplete: 100,
//   removeOnFail: 500,
// });

// export default fetchReposQueue;

import { Queue } from "bullmq";
import connection from "../config/redis.js";

const fetchReposQueue = new Queue("fetch-repos", {
  connection,
});

await fetchReposQueue.add("fetch-repos", {
  repeat: { pattern: "*/5 * * * *" }, // every 5 minutes
  jobId: "fetch-repos-5m", // prevents duplicate schedules
  removeOnComplete: 100,
  removeOnFail: 500,
});

export default fetchReposQueue;
