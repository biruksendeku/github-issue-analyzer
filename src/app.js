import express from "express";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import fetchReposQueue from "./queues/fetchRepos.js";
import reposRouter from "./routers/repos.js";
import authRoutes from "./routers/authentication.js";
import sessionMiddleware from "./middleware/session.js";

import passportLocal from "./config/passport/local.js";
import passportGoogle from "./config/passport/google.js";

const app = express();

app.use(sessionMiddleware);

passportLocal(passport);
passportGoogle(passport);
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/auth", authRoutes);
app.use("/", reposRouter);
app.use("/admin/queues", serverAdapter.getRouter());

export default app;
