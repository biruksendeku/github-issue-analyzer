import addUsernameData from "../utils/addUsername.js";

const addUsernameGet = (req, res) => {
  res.render("addUsername");
};
const addUsername = async (req, res) => {
  const { username } = req.body;
  const { newResult, updatedUser } = await addUsernameData(
    req.user._id,
    username,
  );
  res.status(201).json({
    newResult,
    updatedUser,
  });
};

export { addUsernameGet, addUsername };
