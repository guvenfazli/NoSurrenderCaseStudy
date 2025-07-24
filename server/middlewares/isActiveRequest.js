const redisClient = require('../utils/redis')

exports.isActiveRequest = async (req, res, next) => {
  const isActive = await redisClient.get('isActive/:userId')
  if (isActive) {
    req.isActive = true
    next()
  } else {
    req.isActive = false
    next()
  }
}
