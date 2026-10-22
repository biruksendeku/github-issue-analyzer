const router = require("express").Router();
const { getRepos } = require("../controller/reposGet");

router.use("/", getRepos);

module.exports = router;
