const { Router } = require('express');
const { getData } = require('../controllers/ward.controller');

const wardRouter = Router();

wardRouter.get('/ping', getData)


module.exports = wardRouter;