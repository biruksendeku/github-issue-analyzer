import { fetchRepos } from "../utils/fetchRepos.js";

export const postRepos = async (req, res) => {
  const { username } = req.body;
  const latestRepo = await fetchRepos(username);
  console.log(username);
  console.log(latestRepo);
  res.render("repoResult", {
    username,
    latestRepo,
  });
};
