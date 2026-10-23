import fetchRepos from "../utils/fetchRepos.js";

const postRepos = async (req, res) => {
  const { username } = req.body;
  const latestRepo = await fetchRepos(username);
  res.render("repoResult", {
    username,
    latestRepo,
  });
};

export default postRepos;
