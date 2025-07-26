const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const redisClient = require('./utils/redis')
const { rateLimit } = require('express-rate-limit') // Using Express Rate Limit Package in order to block spams/ddos attacks.
// ROUTES
const itemLimiter = rateLimit({
  windowMs: 2 * 1000,
  limit: 30,          // Max 30 requests in 2 seconds.
  message: "TOO MANY REQUEST",
  standardHeaders: true,
  legacyHeaders: false,
});
const itemRoutes = require('./routes/itemRoutes')
const energyRoutes = require('./routes/energyRoutes')
// MODELS
const Item = require('./models/items')
const Energy = require('./models/energy')

// .env
const dotenv = require('dotenv')
dotenv.config({ path: './.env' });



// MIDDLEWARES
app.use(cors({ // Cors settings
  credentials: true,
  origin: 'http://localhost:3000',
}))
app.use(bodyParser.json()) // Body Parser for incoming Body
app.use((req, res, next) => { // Header Options
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next();
})


// REDIS SETUP

async function createRedis() {
  try {
    await redisClient.connect()
    console.log('Redis connection established.');
  } catch (err) {
    console.log('Redis Client Error', err);
  }
}

createRedis()

// ROUTES
app.use('/', itemLimiter, itemRoutes)
app.use('/energy', energyRoutes)



// Error Middleware
app.use((error, req, res, next) => {
  const message = error.message
  const statusCode = error.statusCode || 500
  res.status(statusCode).json({ message, statusCode })
})

// CONNECTION
mongoose.connect(`${process.env.DB_CONNECTION}`).then((res) => {
  app.listen(process.env.PORT)
  console.log("Server is running!")
}).catch(err => console.log(err))

