const express = require('express');

const { getUserDetails } = require('../controllers/userController.js');

const router = express.Router();

// /user/details => get
router.get('/details', getUserDetails);

module.exports = router;
