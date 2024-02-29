const mongoose = require('mongoose');
const Ward = require('../models/ward.model');
const wardController = require('../controller/ward.controller');
 
describe('Ward Controller - Unit Tests', () => {
  // Mocking the request and response objects
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
 
  // Mocking a sample ward for testing
  const sampleWard = {
    wardNumber: 1,
    wardName: 'Sample Ward',
    totalBeds: 10,
    availableBeds: 5,
    doctors: [],
    patients: [],
  };
 
  describe('create', () => {
    it('should create a new ward successfully', async () => {
      req.body = sampleWard;
      await wardController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining(sampleWard));
    });
 
    it('should handle errors during ward creation', async () => {
      // Mocking a validation error for demonstration
      const error = { name: 'ValidationError', message: 'Validation error' };
      mongoose.Model.prototype.save = jest.fn(() => Promise.reject(error));
 
      req.body = sampleWard;
      await wardController.create(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(error);
    });
  });
 
});