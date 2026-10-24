import express from "express";
const router = express.Router();
import {
  createAccountGet,
  createAccount,
} from "../controller/createAccount.js";

router.get("/signup", createAccountGet);
router.post("/signup", createAccount);

export default router;
