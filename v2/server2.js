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

const axios = require('axios')
const cheerio = require('cheerio')

const getHtml = async () => {
  try {
    return await axios.get('https://www.aladin.co.kr/home/welcome.aspx')
  } catch (error) {
    console.error(error)
  }
}

getHtml()
  .then((html) => {
    let ulList = []
    const $ = cheerio.load(html.data)
    const $bodyList = $('div.welcome_section3').children(
      'div.swiper-slide.swiper-slide-duplicate.swiper-slide-duplicate-active'
    )
    $bodyList.each(function (i, elem) {
      ulList[i] = {
        title: $(this).find('div.list_title.cover').text(),
        url:
          'https://www.aladin.co.kr/home/welcome.aspx' +
          $(this).find('div.list_title.cover').attr('href'),
        image_url: $(this).find('div.list_title.cover a img').attr('src'),
        image_alt: $(this).find('div.list_title.r_text tit').attr('alt')
      }
    })
    const data = ulList.filter((n) => n.title)
    return data
  })
  .then((res) => {
    console.log(res)
  })
