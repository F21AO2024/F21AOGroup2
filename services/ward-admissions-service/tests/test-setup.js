const mongoose = require('mongoose');
 
// Use a different test database or append "test" to the original database name

//TODO: Need to create and add Test db connection below
//const testDatabaseURL = 'MONGODB_CONNECTION_URL';
 
const connectToTestDatabase = async () => {

  await mongoose.connect(testDatabaseURL, {

    useNewUrlParser: true,

    useUnifiedTopology: true,

  });

};
 
const closeTestDatabaseConnection = async () => {

  await mongoose.connection.dropDatabase();

  await mongoose.connection.close();

};
 
// Run this before running any tests
beforeAll(async () => {

  await connectToTestDatabase();

});
 
// Run this after all tests are done
afterAll(async () => {

  await closeTestDatabaseConnection();

});
 
// Run this before each test case
beforeEach(async () => {

});
 
// Run this after each test case
afterEach(async () => {

});
 
module.exports = {

  connectToTestDatabase,

  closeTestDatabaseConnection,

};
