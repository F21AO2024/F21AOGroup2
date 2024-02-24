import { verifyToken } from "../middleware/auth.js";
import express from "express";
import { getDailyTreatment, recordDiagnosis, recordTreatement, getTreatment, getDiagnosis, recordDailyTreatment, signOffTreatment } from "../controller/entry.controller.js";

const router = express.Router();

router.get("/treatment", verifyToken, getTreatment);
router.get("/diagnosis", verifyToken, getDiagnosis);
router.get("/dailyTreatment", verifyToken, getDailyTreatment);
router.post("/recordDiagnosis", verifyToken, recordDiagnosis);
router.post("/recordTreatment", verifyToken, recordTreatement);
router.post("/recordDailyTreatment", verifyToken, recordDailyTreatment);
router.patch("/signOffTreatment", verifyToken, signOffTreatment);

// export default router;
export default router;