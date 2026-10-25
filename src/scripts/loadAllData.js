// import Result from "../models/result.js";
// import User from "../models/user.js";

// Result.find()
//   .then((data) => console.log("Results: ", data))
//   .catch((err) => console.error("Error during Result fetch: ", err.message));

// User.find()
//   .then((data) => console.log("Users: ", data))
//   .catch((err) => console.error("Error during User fetch: ", err.message));

import mongoose from "mongoose";
import User from "../models/user.js";
import Result from "../models/result.js";

// log all data
const fetchData = async (Model) => {
  Model.find()
    .then((data) => console.log(Model.modelName, data))
    .catch((err) => console.error(`${Model.modelName} fetch failed: `, err));
};
// fetch everything
async function runAll() {
  await Promise.all([fetchData(User), fetchData(Result)]);
}
runAll();

// async function sessionLog() {
//   try {
//     const data = await mongoose.connection
//       .collection("sessions")
//       .find({})
//       .toArray();
//     console.log("Sessions: ", data);
//   } catch (err) {
//     console.error("Sessions fetch failed: ", err);
//   }
// }
// sessionLog();
