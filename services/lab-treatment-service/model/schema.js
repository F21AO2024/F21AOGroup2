import mongoose from "../utils/db.js";

const Schema = mongoose.Schema;

const labResultSchema = new Schema({
  labResultId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
    alias: "_id",
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patients",
    required: true,
  },
  diagnosticMachine: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const patientTreatmentSchema = new Schema({
  diagnosisId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
    alias: "_id",
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  diagnosis: {
    type: String,
    required: false,
  },
  treatment: {
    type: String,
    required: false,
  },
  medicine: {
    type: String,
    required: false,
  },
  signedOff: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const dailyTreatmentSchema = new Schema({
  dailyTreatmentId: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
    alias: "_id",
    required: true,
  },
  diagnosisId: {
    ref: "PatientTreatment",
    type: Schema.Types.ObjectId,
    required: true,
  },
  intake: {
    type: String,
    required: false,
  },
  output: {
    type: String,
    required: false,
  },
  progress: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


const Lab = mongoose.model("LabResult", labResultSchema);
const Treatment = mongoose.model("PatientTreatment", patientTreatmentSchema);
const DailyTreatment = mongoose.model("DailyTreatment", dailyTreatmentSchema);

export { Lab, Treatment, DailyTreatment };
