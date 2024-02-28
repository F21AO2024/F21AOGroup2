//this code file isn't used but kept for reference, remove in main branch
const axios = require('axios');

//calls the API endpoint of api gateway to get the employee by id
async function getEmployeeById(id) {
try {
    const response = await axios.get(`http://localhost:3000/api/v1/auth/${id}`);
    return response.data;
} catch (error) {
    console.error(error);
    return null;
}
};
module.exports = { getEmployeeById}; 