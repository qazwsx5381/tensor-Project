const express = require('express')
const request = require('request')
const app = express()
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

app.get('/NewBooks', (req, res) => {
  const url =
    'http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbzoselalswl981112001&QueryType=ItemNewAll&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101'

  request(url, (error, response, body) => {
    if (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    res.header('Access-Control-Allow-Origin', '*') // CORS 설정
    res.send(body)
  })
})

app.get('/homeBestseller', (req, res) => {
  const url =
    'http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbzoselalswl981112001&QueryType=Bestseller&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101'

  request(url, (error, response, body) => {
    if (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    res.header('Access-Control-Allow-Origin', '*') // CORS 설정
    res.send(body)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})


