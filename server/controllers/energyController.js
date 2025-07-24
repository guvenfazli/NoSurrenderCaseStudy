const Energy = require('../models/energy')
const redisClient = require('../utils/redis')

exports.getEnergy = async (req, res, next) => {
  try {
    const cachedItems = await redisClient.get(`energy/:userId`)
    if (cachedItems) {
      const energy = JSON.parse(cachedItems)
      res.status(200).json({ energy })
      return;
    }

    const energy = await Energy.find({})

    await redisClient.set(`energy/:userId`, JSON.stringify(energy[0].energy), { expiration: { type: 'EX', value: 5 * 60 } })

    res.status(200).json({ energy: energy[0].energy })

    return;

  } catch (err) {
    next(err)
  }
}

exports.updateEnergy = async (req, res, next) => {
  // I am using Cache-Aside pattern here because, it is only being run in every 2 minutes. I believe it is safe to use Cache Aside Pattern Here
  const { energy: bodyEnergy } = req.body // Will be using this for if energy is full check

  try {
    const cachedItems = await redisClient.get(`energy/:userId`)
    if (cachedItems) { // If its already cached
      const cachedEnergy = +cachedItems // Gets the cached value
      const updatedEnergy = cachedEnergy + 1
      await redisClient.set(`energy/:userId`, updatedEnergy, { expiration: { type: 'EX', value: 5 * 60 } }) // Updates the cache as well
      await Energy.updateOne({ _id: "688062edebdc5643620fccd6" }, { $set: { energy: updatedEnergy } })
      return res.status(200).json({ energy: updatedEnergy }) // Returns the new energy
    }

    /* If it is not cached */
    const energy = await Energy.find({})
    const updatedEnergy = energy[0].energy + 1
    await redisClient.set(`energy/:userId`, updatedEnergy, { expiration: { type: 'EX', value: 5 * 60 } }) // Sets the cache for future updates
    await Energy.updateOne({ _id: "688062edebdc5643620fccd6" }, { $set: { energy: updatedEnergy } })
    res.status(200).json({ energy: updatedEnergy }) // Returns the current energy level of user
    return;
  } catch (err) {
    next(err)
  }
}