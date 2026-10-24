import "dotenv/config";

import { createServer } from "http";
import mongoose from "mongoose";
const { formatName } = require("./src/utils/formatName.js");
const { PORT, NODE_ENV, MONGODB_URI } = process.env;
import worker from "./src/workers/fetchLatestRepo.js";
import appFile from "./src/app.js";

// server starter function
const start = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    // waiting for mongoose connection for app level uses
    const app = appFile;
    const server = createServer(app);

    // signal handlers
    process.on("SIGINT", () => shutdown("SIGINT", server));
    process.on("SIGTERM", () => shutdown("SIGTERM", server));
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      shutdown("UNCAUGHT_EXCEPTION", server);
    });

    // Start the server ONLY after DB is connected
    server.listen(PORT, () => {
      const nodeEnv = formatName(NODE_ENV);
      console.log(`${nodeEnv} server started on port ${PORT}...`);
    });

    // scripts for logging and deletion
    // require('./src/scripts/log-all');
    // require('./src/scripts/delete-scripts');
  } catch (err) {
    console.error("Failed to start server:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

// Run the start function
start();
