const express = require("express");
const wardController = require("../controller/ward.controller");
const router = express.Router();

router.post("/wards", wardController.create);
router.get("/wards", wardController.getAll);
router.get("/wards/:id", wardController.getById);
router.put("/wards/:id", wardController.update);
router.delete("/wards/:id", wardController.delete);
router.post("/wards/:wardId/doctors/:doctorId", wardController.assignDoctor);
router.post(
  "/wards/:wardId/doctors/:doctorId/patients/:patientId",
  wardController.addPatient
);
router.delete(
  "/wards/:wardId/patients/:patientId",
  wardController.dischargePatient
);

module.exports = router;
