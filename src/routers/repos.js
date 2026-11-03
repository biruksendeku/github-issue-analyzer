import express from "express";
const router = express.Router();
import getIssues from "../controller/getIssues.js";
import fetchLatestIssue from "../controller/fetchLatestIssue.js";
import { addRepoGet, addRepo } from "../controller/addRepo.js";
import { isAuthenticated } from "../middleware/basicAuth.js";

router.get("/", isAuthenticated, getIssues);
router.get("/repo", isAuthenticated, addRepoGet);
router.post("/repo", isAuthenticated, addRepo);
router.post("/issue", isAuthenticated, fetchLatestIssue);

export default router;
