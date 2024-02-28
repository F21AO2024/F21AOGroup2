const mongoose = require("mongoose");
const Ward = require("../models/ward.model");


const wardController = {
  create: async (req, res) => {
    const ward = new Ward(req.body);
    try {
      await ward.save();
      res.status(201).send(ward);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  getAll: async (req, res) => {
    try {
      const wards = await Ward.find({});
      res.send(wards);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getById: async (req, res) => {
    try {
      const ward = await Ward.findById(req.params.id);
      if (!ward) {
        return res.status(404).send();
      }
      res.send(ward);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  update: async (req, res) => {
    try {
      const ward = await Ward.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!ward) {
        return res.status(404).send();
      }
      res.send(ward);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  delete: async (req, res) => {
    try {
      const ward = await Ward.findByIdAndDelete(req.params.id);
      if (!ward) {
        return res.status(404).send();
      }
      res.send(ward);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  assignDoctor: async (req, res) => {
    try {
      const ward = await Ward.findById(req.params.wardId);
      const doctor = await Doctor.findById(req.params.doctorId);
      if (!ward || !doctor) {
        return res.status(404).send();
      }
      ward.doctors.push(doctor);
      await ward.save();
      res.send(ward);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  addPatient: async (req, res) => {
    try {
      const ward = await Ward.findById(req.params.wardId);
      const doctor = await Doctor.findById(req.params.doctorId);
      const patient = await Patient.findById(req.params.patientId);
      if (!ward || !doctor || !patient) {
        return res.status(404).send();
      }
      ward.patients.push({ patient: patient._id, doctor: doctor._id });
      await ward.save();
      res.send(ward);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  dischargePatient: async (req, res) => {
    try {
      const ward = await Ward.findById(req.params.wardId);
      if (!ward) {
        return res.status(404).send();
      }
      ward.patients.id(req.params.patientId).remove();
      await ward.save();
      res.send(ward);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = wardController;
