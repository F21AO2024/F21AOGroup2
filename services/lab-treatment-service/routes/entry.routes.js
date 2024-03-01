import { verifyToken } from "../middleware/auth.js";
import express from "express";
import { getDailyTreatment, recordDiagnosis, recordTreatement, getTreatment, getDiagnosis, recordDailyTreatment, signOffTreatment } from "../controller/entry.controller.js";

const router = express.Router();

router.get("/treatment", verifyToken, getTreatment);
router.get("/diagnosis", verifyToken, getDiagnosis);
router.get("/treatment/daily", verifyToken, getDailyTreatment);
router.post("/diagnosis/record", verifyToken, recordDiagnosis);
router.post("/treatment/record", verifyToken, recordTreatement);
router.post("/treatment/daily/record", verifyToken, recordDailyTreatment);
router.patch("/treatment/signoff", verifyToken, signOffTreatment);

// export default router;
export default router;
