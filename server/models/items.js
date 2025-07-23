const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
  itemType: {
    type: String,
    required: true
  },
  itemLevel: {
    type: Number,
    required: true,
    default: 1
  },
  levelStatus: {
    type: Number,
    required: true,
    default: 0
  },
  itemSpecs: {
    1: {
      name: { type: String, required: true },
      description: { type: String, required: true }
    },
    2: {
      name: { type: String, required: true },
      description: { type: String, required: true }
    },
    3: {
      name: { type: String, required: true },
      description: { type: String, required: true }
    }
  }
})

module.exports = mongoose.model('Item', itemSchema)