require('dotenv').config()
const express = require('express')
const path = require('path')
const _path = path.join(__dirname, './dist')
const logger = require('morgan')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const axios = require('axios')
const key = process.env.Book_api

/* post를 위한 구문 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
/* 스태딕 경로 */
app.use('/', express.static(_path))
/* 로그 정보(최소화 해서 표현) */
app.use(logger('tiny'))

app.post('/about', (req, response) => {
  const book_isbn = response.req.body.scandata
  const url = `https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${key}&result_style=json&page_no=1&page_size=1&isbn=${book_isbn}`
  request(url, (e, res, body) => {
    const send = JSON.parse(body)
    const data = send.docs[0]
    if (data === undefined) {
      const send_data = data
      response.send(send_data)
    } else {
      const websiteUrl =
        'https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=Used&SearchWord=' +
        encodeURIComponent(data.TITLE)
      fetchImages(websiteUrl)
        .then((images) => {
          console.log('Fetched images:', images)
          const send_data = {
            bookname: data.TITLE,
            img: images,
            price: data.PRE_PRICE,
            publisher: data.PUBLISHER,
            public_date: data.PUBLISH_PREDATE,
            author: data.AUTHOR
          }
          response.send(send_data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  })
})

// 이미지, 가격 가져오기
async function fetchImages(url) {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const images = []

    // 이미지 태그를 선택하여 이미지 URL을 가져옴
    $('tr td div.cover_area_other a img').each((index, element) => {
      const imageUrl = $(element).attr('src')
      images.push(imageUrl)
    })
    return images
  } catch (error) {
    console.error('Error fetching images:', error)
    return []
  }
}

app.listen(3000, () => {
  console.log('서버 open')
})
