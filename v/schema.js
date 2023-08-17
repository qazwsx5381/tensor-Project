const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  id: String,
  pw: String,
  name: String,
  mail: String
})

module.exports = mongoose.model('login_info', schema, 'login_info')
