import fetch from "node-fetch";

export const fetchRepos = async (username) => {
  console.log("Fetching repos for", username);
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=1`,
    { headers: { "User-Agent": `${username}-demo` } },
  );
  console.log("GitHub API response status:", res.status);
  if (!res.ok) {
    throw new Error(`GitHUb API error: ${res.status} ${res.statusText}`);
  }
  const repos = await res.json();
  const latest = repos[0];
  console.log("Latest repo for", username, ":", latest);
  return latest;
};
