import session from "express-session";
import { MongoStore } from "connect-mongo";
const { SESSION_SECRET_KEY, NODE_ENV } = process.env;

import connectDb from "../utils/connectDb.js";
const mongoClient = await connectDb();

const sessionMiddleware = session({
  secret: SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,

  store: new MongoStore({
    client: mongoClient,
    collection: "sessions",
    ttl: 7 * 24 * 60 * 60, // 7days in seconds
    autoRemove: "interval",
    autoRemoveInterval: 15, // minutes
  }),
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    sameSite: NODE_ENV !== "development" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
  },
});

export default sessionMiddleware;
