const Energy = require('../models/energy')
const redisClient = require('../utils/redis')

exports.getEnergy = async (req, res, next) => {
  try {
    const cachedItems = await redisClient.get(`energy`)
    if (cachedItems) {
      const energy = JSON.parse(cachedItems)
      res.status(200).json({ energy: energy[0].energy })
      return;
    }

    const energy = await Energy.find({})

    await redisClient.set(`energy`, JSON.stringify(energy), { expiration: { type: 'EX', value: 5 * 60 } })

    res.status(200).json({ energy: energy[0].energy })

    return;

  } catch (err) {
    next(err)
  }
}