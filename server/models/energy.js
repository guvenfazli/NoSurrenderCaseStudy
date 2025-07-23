const mongoose = require('mongoose')
const Schema = mongoose.Schema
const energySchema = new Schema({
  energy: { type: Number, required: true, default: 100 }
})

module.exports = mongoose.model('Energy', energySchema)