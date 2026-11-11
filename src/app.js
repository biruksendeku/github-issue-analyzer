import express from "express";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import fetchIssuesQueue from "./queues/fetchIssues.js";
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
  queues: [new BullMQAdapter(fetchIssuesQueue)],
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
  if (req.accepts(["html", "json"]) === "html" && !req.is("json")) {
    return res.status(404).render("errors/error", {
      statusCode: 404,
      title: "Page not found",
      message: "We couldn’t find the page you were looking for.",
      guidance:
        "Check the address, or head back to your issue dashboard and choose a repository from there.",
      isAuthenticated: req.isAuthenticated?.() ?? false,
    });
  }
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// the overall error-handler
app.use(errorHandler);

export default app;
