import { expect } from "chai";
import { should, use } from "chai";
import supertest from "supertest";
import server from "../index.js";
import mongoose from "mongoose";

const db = process.env.DATABASE_URL_DEV;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmNTkzYjYyLTc4ZmUtNDFjOS1hZTQyLTVmMjBkYzk5NjUyNyIsInJvbGUiOiJEb2N0b3IiLCJpYXQiOjE3MDkyOTYyNjYsImV4cCI6MTcxMTg4ODI2Nn0.ASGFdD1vDtuPjz1QJHfDYi8Nwd55-HD8_LC1IWU-aEY";

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

const Lab = mongoose.model("LabResultTest", labResultSchema);
const Treatment = mongoose.model(
  "PatientTreatmentTest",
  patientTreatmentSchema
);
const DailyTreatment = mongoose.model(
  "DailyTreatmentTest",
  dailyTreatmentSchema
);

describe("DB Connection", () => {
  it("it should return a connection", (done) => {
    mongoose
      .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        done();
      });
  });
});

// clear patienttrement collection
describe("PatientTreatment", () => {
  it("it should clear the collection", async () => {
    const result = await Treatment.deleteMany({});
    expect(result).to.be.an("object");
  });
});

describe("Treatment", () => {
  let diagnosisId;

  describe("POST /api/v1/labtreatment/entry/treatment", () => {
    it("it should create a new treatment", (done) => {
      const treatment = {
        patientId: "60b9d1f8e4b4b9d2e4c6d9c8",
        diagnosis: "Malaria",
        treatment: "IV",
        medicine: "Paracetamol",
      };

      supertest(server)
        .post("/api/v1/labtreatment/entry/treatment")
        .set("Authorization", `Bearer ${token}`)
        .send(treatment)
        .end((err, res) => {
          diagnosisId = res.body.diagnosisId;
          console.log(res.body);
          expect(res.status).to.equal(201);
          done();
        });
    });
  });

  describe("GET /api/v1/labtreatment/entry/treatment/:id", () => {
    it("it should return all treatments", (done) => {
      supertest(server)
        .get(`/api/v1/labtreatment/entry/treatment/${diagnosisId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe("PATCH /api/v1/labtreatment/entry/treatment/:id", () => {
    it("it should update a treatment", (done) => {
      const treatment = {
        treatment: "IV",
        medicine: "Paracetamol",
      };

      supertest(server)
        .patch(`/api/v1/labtreatment/entry/treatment/${diagnosisId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(treatment)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe("PUT /api/v1/labtreatment/entry/diagnosis", () => {
    it("it should create a update diagnosis", (done) => {
      const treatment = {
        diagnosisId: diagnosisId,
        diagnosis: "Flu",
      };

      supertest(server)
        .put("/api/v1/labtreatment/entry/diagnosis")
        .set("Authorization", `Bearer ${token}`)
        .send(treatment)
        .end((err, res) => {
          diagnosisId = res.body.diagnosisId;
          console.log(res.body);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe("GET /api/v1/labtreatment/entry/diagnosis/:id", () => {
    it("it should return all diagnosis", (done) => {
      supertest(server)
        .get(`/api/v1/labtreatment/entry/diagnosis/${diagnosisId}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
