import { Treatment, DailyTreatment } from "../model/schema.js";

export const recordTreatement = async (req, res) => {
  const { patientId, diagnosis, treatment, medicine } = req.body;
  const roles = ["Doctor", "Nurse"]
  const user = req.user;

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  const newTreatment = new Treatment({
    patientId,
    diagnosis,
    treatment,
    medicine,
  });

  try {
    const treatment = await newTreatment.save();
    res.status(201).json(treatment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.find();
    res.status(200).json(treatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const recordDiagnosis = async (req, res) => {
  const { treatmentId, diagnosis } = req.body;
  const roles = ["Doctor"];
  const user = req.user;

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  const newDiagnosis = new Treatment({
    treatmentId,
    diagnosis,
  });

  try {
    const diagnosis = await newDiagnosis.save();
    res.status(201).json(diagnosis);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getDiagnosis = async (req, res) => {
  try {
    const diagnosis = await Treatment.find();
    res.status(200).json(diagnosis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const recordDailyTreatment = async (req, res) => {
  const { treatmentId, intake, output, progress } = req.body;
  const roles = ["Doctor","Nurse"];
  const user = req.user;

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  const newDailyTreatment = new DailyTreatment({
    treatmentId,
    intake,
    output,
    progress,
  });

  try {
    const dailyTreatment = await newDailyTreatment.save();
    res.status(201).json(dailyTreatment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getDailyTreatment = async (req, res) => {
  try {
    const dailyTreatment = await DailyTreatment.find();
    res.status(200).json(dailyTreatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const signOffTreatment = async (req, res) => {
  const { treatmentId, signedOff } = req.body;
  try {
    const treatment = await Treatment.findById(treatmentId);
    treatment.signedOff = signedOff;
    await treatment.save();
    res.status(200).json(treatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
