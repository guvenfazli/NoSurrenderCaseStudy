const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const redisClient = require('./utils/redis')




// ROUTES
const itemRoutes = require('./routes/itemRoutes')


// MODELS
const Item = require('./models/items')


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
  redisClient.on('error', err => console.log('Redis Client Error', err))
  await redisClient.connect()
  console.log('Redis connection established.')
}

createRedis()

// ROUTES

app.use('/', itemRoutes)

// CONNECTION
mongoose.connect(`${process.env.DB_CONNECTION}`).then((res) => {
  app.listen(process.env.PORT)
  console.log("Server is running!")
}).catch(err => console.log(err))

