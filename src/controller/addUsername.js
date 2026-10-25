import addUsernameData from "../utils/addUsername.js";

const addUsernameGet = (req, res) => {
  res.render("addUsername");
};
const addUsername = async (req, res) => {
  const { username } = req.body;
  await addUsernameData(req.user._id, username);
};

export { addUsernameGet, addUsername };
