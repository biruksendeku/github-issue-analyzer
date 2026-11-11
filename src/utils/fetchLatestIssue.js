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
  return response;
};

export const getLatestOpenIssue = (issues) =>
  issues
    .filter((issue) => !issue.pull_request)
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime(),
    )[0] ?? null;

export const createIssueSnapshot = (issue) =>
  issue
    ? {
        id: issue.id,
        number: issue.number,
        title: issue.title,
        htmlUrl: issue.html_url,
        createdAt: new Date(issue.created_at),
      }
    : null;

export default fetchLatestIssue;
