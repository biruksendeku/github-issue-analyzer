import express from "express";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import fetchReposQueue from "./queues/fetchRepos.js";
import reposRouter from "./routers/repos.js";
import sessionMiddleware from "./middleware/session.js";
import errorHandler from "./middleware/errors/handler.js";

import creareAccountRouter from "./routers/createAccount.js";
import localAuthRoutes from "./routers/localAuth.js";
import googleAuthRoutes from "./routers/googleAuth.js";

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

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/auth", creareAccountRouter);
app.use("/auth", localAuthRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/", reposRouter);
app.use("/admin/queues", serverAdapter.getRouter());

// 404 handler middleware
app.use((req, res) => {
  if (req.accepts("html")) {
    return res.status(404).render("errors/404");
  }
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// the overall error-handler
app.use(errorHandler);

export default app;
