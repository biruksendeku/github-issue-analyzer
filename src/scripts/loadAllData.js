import User from "../models/user.js";
import Result from "../models/result.js";

User.findById("6adf9e815d2120a67f67bc3a")
  .then((data) => console.log("Repo Usernames saved: ", data.repoUsernames))
  .catch((err) =>
    console.error("Error fetching saved repo-usernames: ", err.message),
  );

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
