// import dotenv from "dotenv";
// dotenv.config();
// import app from "./src/app.js";

import "dotenv/config";
import app from "./src/app.js";
import worker from "./src/workers/fetchLatestRepo.js";
import Result from "./src/models/result.js";
import User from "./src/models/user.js";

const { PORT } = process.env;

Result.find()
  .then((data) => console.log("Result: ", data))
  .catch((err) => console.error("Error fetching Result data: ", err.messaege));

User.find()
  .then((data) => console.log("User: ", data))
  .catch((err) => console.error("Error fetching User data: ", err.messaege));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
