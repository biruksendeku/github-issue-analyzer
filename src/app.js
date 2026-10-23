import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
import reposRouter from "./routers/repos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares used
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "src", "views"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/", reposRouter);

export default app;
