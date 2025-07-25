const Item = require('../models/items')
const redisClient = require('../utils/redis')
const energyCheck = require('../utils/energyCheck')
const instantEnergy = require('../utils/instantEnergy')
const dataBaseSave = require('../utils/dataBaseSave')

const userRequestList = new Map() // This Map holds the users, who sent a request within the 2 seconds. 
// It will be working with the actual user ID, since i do not have any users or auth system or cookies/JWT etc. i am just writing userId static.

exports.getItems = async (req, res, next) => {
  try {
    const cachedItems = await redisClient.get(`itemList/:userId`)
    if (cachedItems) {
      const itemList = JSON.parse(cachedItems)
      res.status(200).json({ itemList })
      return;
    }

    const itemList = await Item.find({})
    await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })
    res.status(200).json({ itemList })
    return;
  } catch (err) {
    next(err)
  }
}

exports.upgradeLevelStatus = async (req, res, next) => { // Upgrades the status (%) of the item.
  const { cardId } = req.body
  const isActive = req.isActive
  try {
    const updatedEnergy = await energyCheck() // Energy Handler, if it is below 1, throws error, if not, updates the cache or sets the cache for further usage.
    const cachedItems = await redisClient.get(`itemList/:userId`)

    if (cachedItems) { // Updates the cache if the items are already have been cached.
      const itemList = JSON.parse(cachedItems)
      const foundItem = itemList.find((item) => item._id === cardId)
      let updatedStatus;
      if (foundItem.levelStatus !== 100 && foundItem.itemLevel !== 3) {
        foundItem.levelStatus = foundItem.levelStatus + 2
        updatedStatus = foundItem.levelStatus
      }

      await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })

      await redisClient.set(`isActive/:userId`, 'true', { expiration: { type: 'EX', value: 1 * 60 } })
      // Updating the cache and shows that the user sent a request within the 2 seconds.

      /* 
      This section, checks the request list first, if the user sent a request within the 2 seconds, it will clear the timer and onverwrites. If the user is not sending request anymore, which means user stopped, it saves the changes to the database.
      
      I created a util function as dataBaseSave, which chooses the method of the functions, will be executing in order to save changes to the database. 
      */

      const updatedItems = userRequestList.get(`itemList/:userId`)

      if (isActive) clearTimeout(userRequestList.get(`userId`))
      if (updatedItems) {
        const sameItem = updatedItems.some((item) => item.cardId === cardId)
        if (sameItem) {
          const itemIndex = updatedItems.findIndex((item) => item.cardId === cardId)
          updatedItems[itemIndex] = { cardId, updatedStatus }
        } else {
          updatedItems.push({ cardId, updatedStatus });
        }
      }

      const timer = setTimeout(async () => { // Once the timer ends, it saves the changes to the database and removes the user from request queue.
        await dataBaseSave(Item, "upgradeLevelStatus", cardId, updatedEnergy, updatedStatus, updatedItems)
        userRequestList.delete(`userId`)
        userRequestList.delete(`itemList/:userId`)
      }, 2000)


      userRequestList.set(`userId`, timer)
      userRequestList.set(`itemList/:userId`, updatedItems ? updatedItems : [{ cardId, updatedStatus }])

      res.status(200).json({ progress: foundItem.levelStatus, energy: updatedEnergy })
      return;
    }


    /* If there is no cache */
    // I am getting all the items here because, i am imagining that the users will be having an inventory of their items, so it is actually just fetching the items of the user
    const itemList = await Item.find({})

    const foundItem = itemList.find((item) => item._id.toString() === cardId.toString())

    if (foundItem.levelStatus !== 100 && foundItem.itemLevel !== 3) { // Level Status and Item Level Check
      foundItem.levelStatus = foundItem.levelStatus + 2
    }

    await foundItem.save() // saves the item in the array as well, on the first update, it updates the database as well, for further, it updates the cache, no overload.
    await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } }) // Sets the cache for 5 min. 
    await redisClient.set(`isActive/:userId`, 'true', { expiration: { type: 'EX', value: 1 * 60 } })
    res.status(200).json({ progress: foundItem.levelStatus, energy: updatedEnergy })
  } catch (err) {
    next(err)
  }
}

exports.updateLevel = async (req, res, next) => { // Updates the level of the item.
  const { cardId } = req.body
  const isActive = req.isActive
  try {
    const cachedItems = await redisClient.get(`itemList/:userId`)

    if (cachedItems) { // Updates the cache if the items are already have been cached.
      const itemList = JSON.parse(cachedItems)
      const foundItem = itemList.find((item) => item._id === cardId)
      if (foundItem.levelStatus === 100 && foundItem.itemLevel !== 3) {
        foundItem.itemLevel++
        foundItem.levelStatus = 0
      }
      await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })

      await redisClient.set(`isActive/:userId`, 'true', { expiration: { type: 'EX', value: 1 * 60 } })
      // Updating the cache and shows that the user sent a request within the 2 seconds.

      /* This section, checks the request list first, if the user sent a request within the 2 seconds, it will clear the timer and onverwrites. If the user is not sending request anymore, which means user stopped, it saves the changes to the database.
 
      I created a util function as dataBaseSave, which chooses the method of the functions, will be executing in order to save changes to the database. 
      */

      if (isActive) clearTimeout(userRequestList.get(`userId`))

      const timer = setTimeout(async () => { // Once the timer ends, it saves the changes to the database and removes the user from request queue.
        await dataBaseSave(Item, "updateLevel", cardId)
        userRequestList.delete(`userId`)
      }, 2000)

      userRequestList.set(`userId`, timer)
      res.status(200).json({ level: foundItem.itemLevel, progress: 0 })
      return;
    }


    /* If there is no cache */
    // I am getting all the items here because, i am imagining that the users will be having an inventory of their items, so it is actually just fetching the items of the user

    const itemList = await Item.find({})

    const foundItem = itemList.find((item) => item._id.toString() === cardId.toString())

    if (foundItem.levelStatus === 100 && foundItem.itemLevel !== 3) { // Level Status and Item Level Check
      foundItem.itemLevel++
      foundItem.levelStatus = 0
    }

    await foundItem.save() // saves the item in the array as well, on the first update, it updates the database as well, for further, it updates the cache, no overload.
    await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } }) // Sets the cache for 5 min. 

    res.status(200).json({ level: foundItem.itemLevel, progress: 0 })
  } catch (err) {
    next(err)
  }
}

exports.instantLevel = async (req, res, next) => { // Updates the level instantly.
  const { cardId, requiredEnergy } = req.body
  const isActive = req.isActive
  try {
    const cachedItems = await redisClient.get(`itemList/:userId`)
    const cachedEnergy = await instantEnergy(requiredEnergy)

    if (cachedItems) {
      const itemList = JSON.parse(cachedItems)
      const foundItem = itemList.find((item) => item._id === cardId)
      if (foundItem.itemLevel !== 3) {
        foundItem.itemLevel++
        foundItem.levelStatus = 0
      }
      await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })

      await redisClient.set(`isActive/:userId`, 'true', { expiration: { type: 'EX', value: 1 * 60 } })
      // Updating the cache and shows that the user sent a request within the 2 seconds.

      /* 
      This section, checks the request list first, if the user sent a request within the 2 seconds, it will clear the timer and onverwrites. If the user is not sending request anymore, which means user stopped, it saves the changes to the database.
 
      I created a util function as dataBaseSave, which chooses the method of the functions, will be executing in order to save changes to the database. 
      */

      if (isActive) clearTimeout(userRequestList.get(`userId`))

      const timer = setTimeout(async () => { // Once the timer ends, it saves the changes to the database and removes the user from request queue.
        await dataBaseSave(Item, "instantUpdate", cardId, cachedEnergy)
        userRequestList.delete(`userId`)
      }, 2000)
      userRequestList.set(`userId`, timer)

      res.status(200).json({ level: foundItem.itemLevel, progress: 0, energy: cachedEnergy })
      return;
    }

    const itemList = await Item.find({})

    const foundItem = itemList.find((item) => item._id.toString() === cardId.toString())

    if (foundItem.itemLevel !== 3) { // Level Status and Item Level Check
      foundItem.itemLevel++
      foundItem.levelStatus = 0
    }

    await foundItem.save()
    await redisClient.set(`itemList/:userId`, JSON.stringify(itemList), { expiration: { type: 'EX', value: 5 * 60 } })

    res.status(200).json({ level: foundItem.itemLevel, progress: 0, energy: cachedEnergy })
  } catch (err) {
    next(err)
  }
}