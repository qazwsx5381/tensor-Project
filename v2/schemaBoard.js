const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  id: String,
  name: String,
  title: String,
  content: String,
  date: Date,
  load_count: Number,
  boardnum: Number
})

module.exports = mongoose.model('board', schema, 'board')
