const express = require('express');
const router = express.Router();
const itemController = require("../controllers/itemControllers")

router.get('/items', itemController.getItems)


module.exports = router