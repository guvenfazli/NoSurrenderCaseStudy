const express = require('express');
const router = express.Router();
const itemController = require("../controllers/itemControllers")
const isActiveRequest = require('../middlewares/isActiveRequest')


router.get('/items', itemController.getItems)
router.patch('/progress', isActiveRequest.isActiveRequest, itemController.upgradeLevelStatus)
router.patch('/level-up', isActiveRequest.isActiveRequest, itemController.updateLevel)
router.patch('/instant-level', isActiveRequest.isActiveRequest, itemController.instantLevel)


module.exports = router