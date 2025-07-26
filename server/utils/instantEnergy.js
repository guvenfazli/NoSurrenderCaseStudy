const Energy = require('../models/energy')
const redisClient = require('../utils/redis')
const dayjs = require('dayjs')

async function energyCheck(requiredEnergy) {
  try {
    const cachedValue = await redisClient.get('energy/:userId')

    if (cachedValue) {
      const cache = JSON.parse(cachedValue) // Gets the cached value
      const cachedEnergy = cache.energy
      if (cachedEnergy < requiredEnergy) {
        const error = new Error()
        error.message = "Yeterli enerjin yok!"
        throw error
      }
      const now = dayjs();
      const lastUpdate = dayjs.unix(now);

      const updatedEnergy = cachedEnergy - requiredEnergy
      await redisClient.set(`energy/:userId`, JSON.stringify({ energy: updatedEnergy, lastUpdateStamp: lastUpdate }), { expiration: { type: 'EX', value: 5 * 60 } })
      // Updates the cache
      return updatedEnergy

    } else {

      const energy = await Energy.find({})

      if (energy[0].energy < requiredEnergy) {
        const error = new Error()
        error.message = "Yeterli enerjin yok!"
        throw error
      }

      const now = dayjs();
      const lastUpdate = dayjs.unix(now);

      const updatedEnergy = energy[0].energy - requiredEnergy
      await redisClient.set(`energy/:userId`, JSON.stringify({ energy: updatedEnergy, lastUpdateStamp: lastUpdate }), { expiration: { type: 'EX', value: 5 * 60 } })
      return updatedEnergy
    }
  } catch (err) {
    return false
  }

}

module.exports = energyCheck