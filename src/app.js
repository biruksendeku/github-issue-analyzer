
const findData = async (username) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=1`,
        { headers: { 'User-Agent': `${username}-demo` } }
    );
    if (!res.ok) {
        throw new Error(`GitHUb API error: ${res.status} ${res.statusText}`);
    }
    const repos = await res.json();
    const latest = repos[0];
    console.log('Latest repo: ', latest.name, '| published_at:', latest.published_at);
};

findData('bradtraversy');