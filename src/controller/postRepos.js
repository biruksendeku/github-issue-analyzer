import fetchRepos from "../queues/fetchRepos.js";

const postRepos = async (req, res) => {
  const { username } = req.body;
  const job = await fetchRepos.add("fetch-repos", { username });
  const latestRepo = await job.waitUntilFinished();
  res.render("repoResult", {
    username,
    latestRepo,
  });
};

export default postRepos;
