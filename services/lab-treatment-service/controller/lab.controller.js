import { Lab } from "../model/schema.js";

export const recordLabResult = async (req, res) => {
  const { patientId, result } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required!" });
  }

  if (!result) {
    return res.status(400).json({ message: "Result is required!" });
  }

  try {
    const newLabResult = new Lab({
      patientId,
      result,
    });

    const labResult = await newLabResult.save();
    res.status(201).json(labResult);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getLabResult = async (req, res) => {
  const patientId = req.params.id;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required!" });
  }

  try {
    const labResult = await Lab.find({ patientId: patientId });
    res.status(200).json(labResult);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
