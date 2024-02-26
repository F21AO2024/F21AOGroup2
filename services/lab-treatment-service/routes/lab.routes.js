import { verifyToken } from "../middleware/auth.js";
import express from "express";
import { recordLabResult, getLabResult } from "../controller/lab.controller.js";

const router = express.Router();

router.post("/recordLabResult", verifyToken, recordLabResult);
router.get("/labResult", verifyToken, getLabResult);

// module.exports = router;
export default router;


