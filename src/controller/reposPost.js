const { fetchRepos } = require("../utils/fetchRepos");

exports.postRepos = async (req, res) => {
  const { username } = req.body;
  const latestRepo = await fetchRepos(username);
  return latestRepo;
};
