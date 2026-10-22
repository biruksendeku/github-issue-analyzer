const express = require("express");
const path = require("path");
const app = express();
const reposRouter = require("./routers/repos");

// middlewares used
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "src", "views"));

app.use("/", reposRouter);

module.exports = app;