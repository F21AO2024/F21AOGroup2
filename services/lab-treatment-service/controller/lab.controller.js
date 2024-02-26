import { Lab } from "../model/schema.js";

export const recordLabResult = async (req, res) => {
  const { patientId, result } = req.body;
  const newLabResult = new Lab({
    patientId,
    result,
  });

  try {
    const labResult = await newLabResult.save();
    res.status(201).json(labResult);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const getLabResult = async (req, res) => {
  try {
    const labResult = await Lab.find();
    res.status(200).json(labResult);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}