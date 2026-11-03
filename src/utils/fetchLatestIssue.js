import fetch from "node-fetch";
const { GITHUB_TOKEN } = process.env;

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set");
}

const fetchLatestIssue = async (username, repo) => {
  const res = await fetch(
    `https://api.github.com/repos/${username}/${repo}/issues?state=open&sort=created&direction=desc&per_page=5`,
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
  const response = await res.json();
  const pureIssues = response.filter((issues) => !issues.pull_request);
  const latestIssue = pureIssues[0];
  return latestIssue;
};

export default fetchLatestIssue;
