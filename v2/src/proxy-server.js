const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request')
const iconv = require('iconv-lite')

const app = express()
const port = process.env.PORT || 3001

app.listen(3001, () => {
  console.log('http://localhost:3001/')
})

app.use(express.json())

// 신간 도서 목록
app.get('/newBooks', (req, res) => {
  const url =
    'http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbzoselalswl981112001&QueryType=ItemNewAll&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101'

  request(url, (error, response, body) => {
    if (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    res.header('Access-Control-Allow-Origin', '*')
    res.send(body)
  })
})

// 베스트셀러 목록
app.get('/bestseller', (req, res) => {
  const url =
    'http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbzoselalswl981112001&QueryType=Bestseller&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101'

  request(url, (error, response, body) => {
    if (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    res.header('Access-Control-Allow-Origin', '*')
    res.send(body)
  })
})

// 화제의 도서 목록
app.get('/', (req, res) => {
  axios({
    url: 'https://www.aladin.co.kr/home/welcome.aspx',
    method: 'GET'
  })
    .then((response) => {
      const $ = cheerio.load(response.data)

      const welcomeSection = $(
        '.welcome_section3 .swiper-wrapper .swiper-slide'
      )

      const titles = welcomeSection
        .find('.r_text .tit')
        .map((index, element) => $(element).text())
        .get()
      const covers = welcomeSection
        .find('.cover img')
        .map((index, element) => $(element).attr('src'))
        .get()
      const subs = welcomeSection
        .find('.r_text .sub')
        .map((index, element) => $(element).text())
        .get()

      const data = titles.map((title, index) => ({
        title,
        cover: covers[index],
        subtitle: subs[index]
      }))
      res.header('Access-Control-Allow-Origin', '*')
      res.send(data)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Internal Server Error')
    })
})

// 이달의 주목도서 목록
app.get('/dd', (req, res) => {
  axios({
    url: 'https://www.aladin.co.kr/home/welcome.aspx',
    method: 'GET'
  })
    .then((response) => {
      const $ = cheerio.load(response.data)

      const monthBook = $('#w_monthBook_wrapper')

      const titles = monthBook
        .find('.text .tit')
        .map((index, element) => $(element).text())
        .get()
      const covers = monthBook
        .find('.cover img')
        .map((index, element) => $(element).attr('src'))
        .get()

      const data = titles.map((title, index) => ({
        title,
        cover: covers[index]
      }))
      res.header('Access-Control-Allow-Origin', '*')
      res.json(data)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Internal Server Error')
    })
})

// 인기검색어 순위
app.get('/', (req, res) => {
  axios({
    url: 'https://www.yes24.com/main/default.aspx',
    method: 'GET',
    responseType: 'arraybuffer'
  })
    .then((response) => {
      const data = iconv.decode(response.data, 'euc-kr')
      const $ = cheerio.load(data)
      const rank = []

      $('span.txt').each(function () {
        rank.push($(this).text())
      })

      rank.forEach((v, i) => {
        console.log(`${i + 1}위: ${v}`)
      })

      res.send(rank)
    })
    .catch((error) => {
      console.error('Error:', error)
      res.status(500).send('An error occurred.')
    })
})
