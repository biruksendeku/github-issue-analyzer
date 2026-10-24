import fetchLatestRepoData from "../utils/fetchLatestRepo.js";

const fetchLatestRepo = async (req, res) => {
  const { username } = req.body;
  const latestRepo = await fetchLatestRepoData(username);
  console.log(
    "Latest Repo from the controller called by the worker: ",
    latestRepo,
  );
  return latestRepo;
};

export default fetchLatestRepo;
