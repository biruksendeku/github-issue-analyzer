import fetchLatestRepoData from "../utils/fetchLatestRepo.js";

const fetchLatestRepo = async (req, res) => {
  const { username } = req.body;
  const latestRepo = await fetchLatestRepoData(username);
  // console.log("Latest repo full_name: ", latestRepo.full_name);
  return latestRepo;
};

export default fetchLatestRepo;
