const router = require("express").Router();
const { getRepos } = require("../controller/getRepos");
const { postRepos } = require("../controller/postRepos");

router.use("/", getRepos);
router.post("/repo", postRepos);

module.exports = router;
