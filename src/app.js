const express = require("express");
const app = express();

// middlewares used
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
        <form action='/repos' method='post'>
            <input type='text' name='username' placeholder='Enter GitHub username' />
            <button type='submit'>Find Latest Repo</button>
        </form>
        `);
});

module.exports = app;
