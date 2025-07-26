const { createClient } = require('redis');

const client = createClient();

async function createRedis() {
  redisClient.on('error', err => console.log('Redis Client Error', err))
  await redisClient.connect()
  console.log('Redis connection established.')
}

createRedis()

module.exports = client;