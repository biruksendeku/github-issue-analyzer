import express from "express";
const router = express.Router();
import getIssues from "../controller/getIssues.js";
import fetchLatestIssue from "../controller/fetchLatestIssue.js";
import { addUsernameGet, addUsername } from "../controller/addUsername.js";
import { isAuthenticated } from "../middleware/basicAuth.js";

router.get("/", isAuthenticated, getIssues);
router.get("/repo", isAuthenticated, addUsernameGet);
router.post("/repo", isAuthenticated, addUsername);
router.post("/issue", isAuthenticated, fetchLatestIssue);

export default router;
