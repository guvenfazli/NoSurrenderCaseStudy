const Item = require('../models/items')
const redisClient = require('../utils/redis')
exports.getItems = async (req, res, next) => {
  try {
    const cachedItems = await redisClient.get(`itemList`)
    if (cachedItems) {
      const itemList = JSON.parse(cachedItems)
      res.status(200).json({ itemList })
      return;
    }
    const itemList = await Item.find({})
    await redisClient.set(`itemList`, JSON.stringify(itemList), { EX: 5 * 60 })
    res.status(200).json({ itemList })
    return;
  } catch (err) {
    console.log(err)
  }
}