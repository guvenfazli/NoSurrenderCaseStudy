const Energy = require('../models/energy')
const redisClient = require('../utils/redis')

async function energyCheck() {
  try {
    const cachedValue = await redisClient.get('energy')

    if (cachedValue) {
      const cachedEnergy = +cachedValue // Gets the cached value

      if (cachedEnergy < 1) {
        const error = new Error()
        error.message = "Yeterli enerjin yok!"
        throw error
      }

      const updatedEnergy = cachedEnergy - 1
      await redisClient.set(`energy`, updatedEnergy, { expiration: { type: 'EX', value: 5 * 60 } }) // Updates the cache
      return updatedEnergy

    } else {
      const energy = await Energy.find({})

      if (energy[0].energy < 1) {
        const error = new Error()
        error.message = "Yeterli enerjin yok!"
        throw error
      }

      const updatedEnergy = energy[0].energy - 1
      await redisClient.set(`energy`, updatedEnergy, { expiration: { type: 'EX', value: 5 * 60 } })
      return updatedEnergy
    }
  } catch (err) {
    return false
  }

}

module.exports = energyCheck