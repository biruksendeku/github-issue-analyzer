// import dotenv from "dotenv";
// dotenv.config();
// import app from "./src/app.js";

import "dotenv/config";
import app from "./src/app.js";
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
