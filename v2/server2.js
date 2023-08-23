const request = require('request')
require('dotenv').config()

const { XMLParser } = require('fast-xml-parser')
const parser = new XMLParser()

const url =
  'http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=ttbzoselalswl981112001&QueryType=ItemNewAll&MaxResults=10&Cover=Big&start=1&SearchTarget=Book&output=xml&Version=20131101'

request(url, (e, res, body) => {
  const rst = parser.parse(body)
  const _ = rst.object.item
  console.log(_)
})
