const express = require('express');
const router = express.Router();
const itemController = require("../controllers/itemControllers")

router.get('/items', itemController.getItems)
router.patch('/progress', itemController.upgradeLevelStatus)
router.patch('/level-up', itemController.updateLevel)


module.exports = router