const Item = require('../models/items')
const redisClient = require('../utils/redis')
const energyCheck = require('../utils/energyCheck')
exports.getItems = async (req, res, next) => {
  try {
    const cachedItems = await redisClient.get(`itemList`)
    if (cachedItems) {
      const itemList = JSON.parse(cachedItems)
      res.status(200).json({ itemList })
      return;
    }

    const itemList = await Item.find({})
    await redisClient.set(`itemList`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })
    res.status(200).json({ itemList })
    return;

  } catch (err) {
    next(err)
  }
}

exports.upgradeLevelStatus = async (req, res, next) => {
  const { energy } = req.body
  const { itemId } = req.params

  try {
    const updatedEnergy = await energyCheck(energy) // Energy Handler, if it is below 2, throws error, if not, updates the cache or sets the cache for further usage.
    const cachedItems = await redisClient.get(`itemList`)

    if (!updatedEnergy) {
      const error = new Error()
      error.message = "You do not have enough energy!"
      throw error
    }

    if (cachedItems) { // Updates the cache if the items are already have been cached.
      const itemList = JSON.parse(cachedItems)
      const foundItem = itemList.find((item) => item._id === itemId)
      if (foundItem.levelStatus !== 100 && foundItem.itemLevel !== 3) {
        foundItem.levelStatus = foundItem.levelStatus + 2
      }
      await redisClient.set(`itemList`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })
      res.status(200).json({ itemList, energy: updatedEnergy })
      return;
    }


    /* If there is no cache */
    // I am getting all the items here because, i am imagining that the users will be having an inventory of their items, so it is actually just fetching the items of the user
    const itemList = await Item.find({})

    const foundItem = itemList.find((item) => item._id.toString() === itemId.toString())

    if (foundItem.levelStatus !== 100 && foundItem.itemLevel !== 3) { // Level Status and Item Level Check
      foundItem.levelStatus = foundItem.levelStatus + 2
    }

    await foundItem.save()
    await redisClient.set(`itemList`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } }) // Sets the cache for 5 min. 
    res.status(200).json({ itemList, energy: updatedEnergy })
  } catch (err) {
    next(err)
  }
}