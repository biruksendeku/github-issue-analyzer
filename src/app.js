import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import fetchReposQueue from "./queues/fetchRepos.js";
import reposRouter from "./routers/repos.js";

const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({
  queues: [new BullMQAdapter(fetchReposQueue)],
  serverAdapter: serverAdapter,
});

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
app.use("/admin/queues", serverAdapter.getRouter());

export default app;
