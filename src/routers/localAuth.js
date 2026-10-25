import express from "express";
const router = express.Router();
import passport from "passport";
import { login, loginGet, logout } from "../controller/localAuth.js";

router.get("/login", loginGet);
router.post("/login", login(passport));
router.get("/logout", logout);

export default router;
