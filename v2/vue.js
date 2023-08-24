const express = require('express')
const history = require('connect-history-api-fallback')
const path = require('path')
const app = express()
require('dotenv').config()

app.use(history())
const _path = path.join(__dirname, './dist')
app.use('/', express.static(_path))

app.listen(3000, () => {
  console.log('listening on port 3000!!')
})
