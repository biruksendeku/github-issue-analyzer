import session from "express-session";
import mongoose from "mongoose";
import { MongoStore } from "connect-mongo";
const { SESSION_SECRET_KEY, NODE_ENV } = process.env;

const sessionMiddleware = session({
  secret: SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,

  store: new MongoStore({
    client: mongoose.connection.getClient(),
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
