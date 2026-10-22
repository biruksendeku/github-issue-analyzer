const path = require("path");

exports.getRepos = async (req, res) => {
  res.send(path.join(publicFolder, "index.html"));
};
