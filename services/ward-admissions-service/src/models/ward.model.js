const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema(
  {
    wardNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    wardName: {
      type: String,
      required: true,
    },
    totalBeds: {
      type: Number,
      required: true,
    },
    availableBeds: {
      type: Number,
      required: true,
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    patients: [
      {
        patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Patient",
        },
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Doctor",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Ward", wardSchema);
