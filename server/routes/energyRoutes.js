const express = require('express');
const router = express.Router();
const energyController = require("../controllers/energyController")

router.get('/', energyController.getEnergy)
router.patch('/updateEnergy', energyController.updateEnergy)

module.exports = router