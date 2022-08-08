const roomController = require('../controller/roomController');
const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');


const router = express.Router();
router.use(verifyJWT);
router.get('/details',roomController.getDetails);

module.exports = router;