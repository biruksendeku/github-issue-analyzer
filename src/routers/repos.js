import express from "express";
const router = express.Router();
import { getRepos } from "../controller/getRepos.js";
import { postRepos } from "../controller/postRepos.js";

router.use("/", getRepos);
router.post("/repo", postRepos);

export default router;
