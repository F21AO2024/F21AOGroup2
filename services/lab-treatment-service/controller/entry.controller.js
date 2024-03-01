import { Treatment, DailyTreatment } from "../model/schema.js";

export const recordTreatement = async (req, res) => {
  const { patientId, diagnosis, treatment, medicine } = req.body;
  const roles = ["Doctor", "Nurse"];
  const user = req.user;

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required!" });
  }

  if (!diagnosis || !treatment || !medicine) {
    return res
      .status(400)
      .json({ message: "Diagnosis, treatment, and medicine are required!" });
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
    const diagnosisId = req.params.id;

    if (!diagnosisId) {
      return res.status(400).json({ message: "Diagnosis ID is required!" });
    }

    const treatment = await Treatment.findById(diagnosisId);

    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found!" });
    }

    res.status(200).json(treatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const recordDiagnosis = async (req, res) => {
  const { diagnosisId, diagnosis } = req.body;
  const roles = ["Doctor"];
  const user = req.user;

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  if (!diagnosisId) {
    return res.status(400).json({ message: "Diagnosis ID is required!" });
  }

  if (!diagnosis) {
    return res.status(400).json({ message: "Diagnosis is required!" });
  }

  try {
    const updatedDiagnosis = await Treatment.findByIdAndUpdate(
      diagnosisId,
      { diagnosis },
      { new: true }
    );
    res.status(200).json(updatedDiagnosis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDiagnosis = async (req, res) => {
  try {
    const diagnosisId = req.params.id;
    if (!diagnosisId) {
      return res.status(400).json({ message: "Diagnosis ID is required!" });
    }

    const diagnosis = await Treatment.findById(diagnosisId);

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found!" });
    }

    res.status(200).json(diagnosis);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const recordDailyTreatment = async (req, res) => {
  const { diagnosisId, intake, output, progress } = req.body;
  const roles = ["Doctor", "Nurse"];
  const user = req.user;

  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  if (!diagnosisId) {
    return res.status(400).json({ message: "Diagnosis ID is required!" });
  }

  if (!intake && !output && !progress) {
    return res.status(400).json({
      message: "At least one of intake, output, or progress is required!",
    });
  }

  const newDailyTreatment = new DailyTreatment({
    diagnosisId,
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
    const diagnosisId = req.params.id;
    if (!diagnosisId) {
      return res.status(400).json({ message: "Diagnosis ID is required!" });
    }

    const dailyTreatment = await DailyTreatment.find({ diagnosisId });
    if (!dailyTreatment) {
      return res.status(404).json({ message: "Daily treatment not found!" });
    }

    res.status(200).json(dailyTreatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const signOffTreatment = async (req, res) => {
  const { diagnosisId, signedOff } = req.body;
  try {
    if (!diagnosisId) {
      return res.status(400).json({ message: "Diagnosis ID is required!" });
    }

    if (signedOff === undefined) {
      return res.status(400).json({ message: "Signed off is required!" });
    }

    const treatment = await Treatment.findByIdAndUpdate(
      diagnosisId,
      { signedOff },
      { new: true }
    );

    res.status(200).json(treatment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
