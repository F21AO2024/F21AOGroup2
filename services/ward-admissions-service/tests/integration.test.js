const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming your Express app is in 'app.js'
 
describe('Ward Controller - Integration Tests', () => {
  // Mocking a sample ward for testing
  const sampleWard = {
    wardNumber: 1,
    wardName: 'Sample Ward',
    totalBeds: 10,
    availableBeds: 5,
    doctors: [],
    patients: [],
  };
 
  describe('POST /wards', () => {
    it('should create a new ward successfully', async () => {
      const response = await request(app)
        .post('/wards')
        .send(sampleWard);
 
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(sampleWard));
    });
  });
 
});