import express from "express";
const router = express.Router();
import passport from "passport";
import { googleAuth, googleAuthCallback } from "../controller/googleAuth.js";

router.get("/google", googleAuth(passport));
router.get("/google/callback", googleAuthCallback(passport));

export default router;
