const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <form action='/repos' method='post'>
            <input type='text' name='username' placeholder='Enter GitHub username' />
            <button type='submit'>Find Latest Repo</button>
        </form>
        `)
});

app.post('/repos', (req, res) => {
    const { username } = req.body;
    findRepo(username).then((latest) => {
        res.send(`Latest repo for ${username}: ${latest.name}`);
    }).catch((error) => {
        res.status(500).send('Error finding latest repo');
    });
});

const findRepo = async (username) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=1`,
        { headers: { 'User-Agent': `${username}-demo` } }
    );
    if (!res.ok) {
        throw new Error(`GitHUb API error: ${res.status} ${res.statusText}`);
    }
    const repos = await res.json();
    const latest = repos[0];
    console.log('Latest repo: ', latest.name, '| published_at:', latest.published_at);
    return latest;
};

module.exports = app;