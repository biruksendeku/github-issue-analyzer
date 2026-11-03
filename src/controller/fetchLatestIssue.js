import fetchLatestIssueData from "../utils/fetchLatestIssue.js";

const fetchLatestIssue = async (req, res) => {
  const { username, repo } = req.body;
  const latestRepo = await fetchLatestIssueData(username, repo);
  // console.log("Latest repo full_name: ", latestRepo.full_name);
  return latestRepo;
};

export default fetchLatestIssue;
