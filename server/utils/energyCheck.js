const Energy = require('../models/energy')
const redisClient = require('../utils/redis')

async function energyCheck() {
  try {
    const cachedValue = await redisClient.get('energy/:userId')

    if (cachedValue) {
      const cache = JSON.parse(cachedValue) // Gets the cached value
      const cachedEnergy = +cache.energy

      if (cachedEnergy < 1) {
        const error = new Error()
        error.message = "Yeterli enerjin yok!"
        throw error
      }

      const updatedEnergy = cachedEnergy - 1
      await redisClient.set(`energy/:userId`, JSON.stringify({ energy: updatedEnergy, lastUpdateStamp: cachedEnergy.lastUpdateStamp }), { expiration: { type: 'EX', value: 5 * 60 } }) // Updates the cache
      return updatedEnergy

    } else {
      const energy = await Energy.findOne({ _id: "688062edebdc5643620fccd6" })

      if (energy.energy < 1) {
        const error = new Error()
        error.message = "Yeterli enerjin yok!"
        throw error
      }

      const updatedEnergy = energy.energy - 1
      await redisClient.set(`energy/:userId`, JSON.stringify({ energy: updatedEnergy, lastUpdateStamp: energy.lastUpdateStamp }), { expiration: { type: 'EX', value: 5 * 60 } })
      return updatedEnergy
    }
  } catch (err) {
    return false
  }

}

module.exports = energyCheck