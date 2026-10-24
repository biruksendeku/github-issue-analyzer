import express from "express";
const router = express.Router();
import getRepos from "../controller/getRepos.js";
import fetchLatestRepo from "../controller/fetchLatestRepo.js";
import addUsername from "../controller/addUsername.js";

router.get("/", getRepos);
router.post("/username", addUsername);
router.post("/repo", fetchLatestRepo);

export default router;
