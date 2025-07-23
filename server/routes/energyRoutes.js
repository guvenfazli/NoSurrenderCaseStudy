const express = require('express');
const router = express.Router();
const energyController = require("../controllers/energyController")

router.get('/', energyController.getEnergy)

module.exports = router