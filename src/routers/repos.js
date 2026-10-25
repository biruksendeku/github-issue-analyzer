import express from "express";
const router = express.Router();
import getRepos from "../controller/getRepos.js";
import fetchLatestRepo from "../controller/fetchLatestRepo.js";
import addUsername from "../controller/addUsername.js";
import { isAuthenticated } from "../middleware/basicAuth.js";

router.get("/", isAuthenticated, getRepos);
router.post("/username", isAuthenticated, addUsername);
router.post("/repo", isAuthenticated, fetchLatestRepo);

export default router;
