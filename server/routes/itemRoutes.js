const express = require('express');
const router = express.Router();
const itemController = require("../controllers/itemControllers")

router.get('/items', itemController.getItems)
router.patch('/upgradeLevelStatus/:itemId', itemController.upgradeLevelStatus)


module.exports = router