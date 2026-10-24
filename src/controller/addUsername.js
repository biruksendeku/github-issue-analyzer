import addUsernameData from "../utils/addUsername.js";
const addUsername = async (req, res) => {
  const { username } = req.body;
  await addUsernameData(req.user._id, username);
};

export default addUsername;
