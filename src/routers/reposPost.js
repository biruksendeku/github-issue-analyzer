const router = require("express").Router();
const { postRepos } = require("../controller/reposPost");

router.post("/repo", postRepos);

module.exports = router;
