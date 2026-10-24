import addUsername from "../utils/addUsername.js";
export async function addUsername(req, res) {
  const { username } = req.body;
  await addUsername(req.user._id, username);
}
