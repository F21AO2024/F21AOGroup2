import { verifyToken } from "../middleware/auth";
import express from "express";
import { getDailyTreatment, recordDiagnosis, recordTreatement, getTreatment, getDiagnosis, recordDailyTreatment, signOffTreatment } from "../controller/entryController";

const router = express.Router();


module.exports = router;