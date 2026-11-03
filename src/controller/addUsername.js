import addRepoData from "../utils/addRepo.js";

const addRepoGet = (req, res) => {
  res.render("addRepo");
};
const addUsername = async (req, res) => {
  const { username, repo } = req.body;
  const { newResult, updatedUser } = await addRepoData(
    req.user._id,
    username,
    repo,
  );
  res.status(201).json({
    newResult,
    updatedUser,
  });
};

export { addRepoGet, addRepo };
