import "dotenv/config";

import { createServer } from "http";
import { formatName } from "./src/utils/formatName.js";
const { PORT, NODE_ENV } = process.env;

import app from "./src/app.js";
const server = createServer(app);

server.listen(PORT, () => {
  const nodeEnv = formatName(NODE_ENV);
  console.log(`${nodeEnv} server started on port ${PORT}...`);
});
