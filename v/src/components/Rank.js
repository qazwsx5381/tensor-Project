const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

const url = 'https://www.yes24.com/main/default.aspx'
axios
  .get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' })
  .then((res) => {
    const data = iconv.decode(res.data, 'euc-kr')
    const $ = cheerio.load(data)
    const rank = []
    $('span.txt').each(function () {
      rank.push($(this).text())
    })
    rank.forEach((v, i) => {
      console.log(`${i + 1}위: ${v}`)
    })
  })
