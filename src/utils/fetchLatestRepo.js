import fetch from "node-fetch";
const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set");
}

const fetchLatestRepos = async (username) => {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=1`,
    {
      headers: {
        "User-Agent": `${username}-demo`,
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    },
  );
  if (!res.ok) {
    throw new Error(`GitHUb API error: ${res.status} ${res.statusText}`);
  }
  const repos = await res.json();
  const latestRepo = repos[0];
  return latestRepo;
};

export default fetchLatestRepos;
