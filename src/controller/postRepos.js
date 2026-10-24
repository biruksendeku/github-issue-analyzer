import saveUsername from "../utils/saveUsername.js";

const postRepos = async (req, res) => {
  const { username } = req.body;

  await saveUsername(req.user._id, username);

  // const job = await fetchRepos.add("fetch-repos", { username });
  // res.render("repoResult", {
  //   username,
  //   latestRepo: "I don't know",
  // });
};

export default postRepos;
