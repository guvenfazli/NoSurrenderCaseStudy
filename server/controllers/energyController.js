const Energy = require('../models/energy')
const redisClient = require('../utils/redis')
const dayjs = require('dayjs')
exports.getEnergy = async (req, res, next) => {
  try {
    const cachedItems = await redisClient.get(`energy/:userId`)
    if (cachedItems) { // If it is cached, updates the energy with the calculation of timestamps. 
      const energy = JSON.parse(cachedItems)
      const now = dayjs();
      const lastUpdate = dayjs.unix(energy.lastUpdateStamp);

      const elapsedMinutes = now.diff(lastUpdate, "minute");
      const energyToAdd = Math.floor(elapsedMinutes / 2);

      let updatedEnergy = energy.energy;

      if (energyToAdd > 0) {
        updatedEnergy = Math.min(energy.energy + energyToAdd, 100);
        const updatedTimestamp = lastUpdate.add(energyToAdd * 2, "minute").unix();
        await redisClient.set(
          `energy/:userId`,
          JSON.stringify({ energy: updatedEnergy, lastUpdateStamp: updatedTimestamp }),
          { EX: 5 * 60 }
        );
      }

      res.status(200).json({ energy: updatedEnergy })
      return;
    }

    const energy = await Energy.findOne({ _id: "688062edebdc5643620fccd6" }) // If it is not cached, gets it from database, updates the latestupdate timestamp with the current one, caches it and returns it. 

    const now = dayjs()
    const lastUpdateStamp = dayjs().unix(now)
    await Energy.updateOne({ _id: "688062edebdc5643620fccd6" }, { $set: { lastUpdateStamp: lastUpdateStamp } })

    await redisClient.set(`energy/:userId`, JSON.stringify({ energy: energy.energy, lastUpdateStamp: lastUpdateStamp }), { expiration: { type: 'EX', value: 5 * 60 } })

    res.status(200).json({ energy: energy.energy, lastUpdateStamp })

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
      const cachedEnergy = JSON.parse(cachedItems) // Gets the cached value
      const updatedEnergy = +cachedEnergy.energy < 100 ? +cachedEnergy.energy + 1 : +cachedEnergy.energy
      const now = dayjs();
      const lastUpdateStamp = dayjs().unix(now)
      await redisClient.set(`energy/:userId`, JSON.stringify({ energy: updatedEnergy, lastUpdateStamp }), { expiration: { type: 'EX', value: 5 * 60 } })
      // Updates the cache as well
      await Energy.updateOne({ _id: "688062edebdc5643620fccd6" }, { $set: { energy: updatedEnergy, lastUpdateStamp } })
      return res.status(200).json({ energy: updatedEnergy }) // Returns the new energy
    }

    /* If it is not cached */
    const energy = await Energy.findOne({ _id: "688062edebdc5643620fccd6" })
    const updatedEnergy = energy.energy < 100 ? energy.energy + 1 : energy.energy
    await redisClient.set(`energy/:userId`, updatedEnergy, { expiration: { type: 'EX', value: 5 * 60 } }) // Sets the cache for future updates
    await Energy.updateOne({ _id: "688062edebdc5643620fccd6" }, { $set: { energy: updatedEnergy } })
    res.status(200).json({ energy: updatedEnergy }) // Returns the current energy level of user
    return;
  } catch (err) {
    next(err)
  }
}