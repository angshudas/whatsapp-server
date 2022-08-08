const express = require('express');
const User = require('../model/User');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/refresh').get(authController.refresh);

module.exports = router;