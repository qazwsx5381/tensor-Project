// const request = require('request')
// require('dotenv').config()

// const { XMLParser } = require('fast-xml-parser')
// const parser = new XMLParser()

// const url =
//   'http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbzoselalswl981112001&QueryType=Bestseller&MaxResults=10&Cover=Big&start=1&SearchTarget=Book&output=xml&Version=20131101'

// request(url, (e, res, body) => {
//   const rst = parser.parse(body)
//   const _ = rst.object.item
//   console.log(_)
// })

// const axios = require('axios')
// const cheerio = require('cheerio')

// const getHtml = async () => {
//   try {
//     return await axios.get('https://www.aladin.co.kr/home/welcome.aspx')
//   } catch (error) {
//     console.error(error)
//   }
// }

// getHtml()
//   .then((html) => {
//     let ulList = []
//     const $ = cheerio.load(html.data)
//     const $bodyList = $('div.welcome_section3').children(
//       'div.swiper-slide.swiper-slide-duplicate.swiper-slide-duplicate-active'
//     )
//     $bodyList.each(function (i, elem) {
//       ulList[i] = {
//         title: $(this).find('div.list_title.cover').text(),
//         url:
//           'https://www.aladin.co.kr/home/welcome.aspx' +
//           $(this).find('div.list_title.cover').attr('href'),
//         image_url: $(this).find('div.list_title.cover a img').attr('src'),
//         image_alt: $(this).find('div.list_title.r_text tit').attr('alt')
//       }
//     })
//     const data = ulList.filter((n) => n.title)
//     return data
//   })
//   .then((res) => {
//     console.log(res)
//   })

// const axios = require('axios')
// const cheerio = require('cheerio')

// axios({
//   url: 'https://www.aladin.co.kr/home/welcome.aspx',
//   method: 'GET'
// })
//   .then((response) => {
//     const $ = cheerio.load(response.data)

//     // 원하는 요소의 선택자를 사용하여 데이터 추출
//     const items = $('.swiper-wrapper .swiper-slide')

//     items.each((index, element) => {
//       const cover = $(element).find('.cover img').attr('src')
//       const title = $(element).find('.r_text .tit').text()
//       const sub = $(element).find('.r_text .sub').text()

//       console.log(cover)
//       console.log(title)
//       console.log(sub)
//     })
//   })
//   .catch((err) => {
//     console.error(err)
//   })

// const axios = require('axios')
// const cheerio = require('cheerio')

// axios({
//   url: 'https://www.aladin.co.kr/home/welcome.aspx',
//   method: 'GET'
// })
//   .then((response) => {
//     const $ = cheerio.load(response.data)

//     // 원하는 클래스를 가진 부분에서 데이터 추출
//     const welcomeSection = $('.welcome_section3 .swiper-wrapper .swiper-slide')

//     const titles = welcomeSection
//       .find('.r_text .tit')
//       .map((index, element) => $(element).text())
//       .get()
//     const covers = welcomeSection
//       .find('.cover img')
//       .map((index, element) => $(element).attr('src'))
//       .get()
//     const subs = welcomeSection
//       .find('.r_text .sub')
//       .map((index, element) => $(element).text())
//       .get()

//     for (let i = 0; i < titles.length; i++) {
//       console.log(`Cover: ${covers[i]}`)
//       console.log(`Title: ${titles[i]}`)
//       console.log(`Subtitle: ${subs[i]}`)
//       console.log('---------------------------------')
//     }
//   })
//   .catch((err) => {
//     console.error(err)
//   })

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const port = 3000

app.get('/', (req, res) => {
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

app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`)
})
