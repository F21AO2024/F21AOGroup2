import { Lab } from "../model/schema.js";

export const recordLabResult = async (req, res) => {
  const { patientId, result, diagnosticMachine } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required!" });
  }

  if (!result || !diagnosticMachine) {
    return res
      .status(400)
      .json({ message: "Result and diagnostic machine are required!" });
  }

  try {
    const newLabResult = new Lab({
      patientId,
      result,
      diagnosticMachine,
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
