require('dotenv').config()
const express = require('express')
const path = require('path')
const _path = path.join(__dirname, '')
const logger = require('morgan')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')
const xml2js = require('xml2js')
const ExcelJS = require('exceljs')

const Alkey = process.env.aladdin_api

/* post를 위한 구문 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
/* 스태딕 경로 */
app.use('/', express.static(_path))
/* 로그 정보(최소화 해서 표현) */
app.use(logger('tiny'))
app.use(cookieParser())
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

//tensorflow 데이터 excel로 저장
const excelFile = 'api_data.xlsx'
const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet('Sheet1')
sheet.addRow(['isbn13', 'priceSales', 'salesPoint'])
const bestUrl = []
for (let i = 0; i < 20; i++) {
  bestUrl[
    i
  ] = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${Alkey}&QueryType=Bestseller&MaxResults=100&Cover=Big&start=${
    i + 1
  }&SearchTarget=Book&Version=20131101`
}
/* excel 최신화 시키는 function 1번째 함수 */
fetchAndSaveData()

// tensor용 기본 데이터 파일 생성
async function fetchAndSaveData() {
  for (const url of bestUrl) {
    try {
      await fetchAndParseXml(url)
      console.log(`Data processed`)
    } catch (error) {
      console.error(`Error processing data from ${url}:`, error)
    }
  }

  // Excel 파일 저장
  workbook.xlsx
    .writeFile(excelFile)
    .then(() => {
      console.log(`API 데이터를 ${excelFile}로 저장 완료!`)
    })
    .catch((writeErr) => {
      console.error('Error writing Excel file:', writeErr)
    })
}
// 베스트 셀러의 isbn코드, 판매가격과 할인판매가격을 불러와 엑셀에 추가
function fetchAndParseXml(url) {
  return axios
    .get(url)
    .then((response) => response.data)
    .then(
      (xmlData) =>
        new Promise((resolve, reject) => {
          xml2js.parseString(xmlData, (parseErr, result) => {
            if (parseErr) {
              reject(parseErr)
              return
            }
            console.log(result)
            const items = result.object.item

            items.forEach((item, i) => {
              sheet.addRow([
                item.isbn13[0] ? item.isbn13[0] : item.isbn[0],
                item.priceSales[0],
                item.salesPoint[0]
              ])
            })

            resolve()
          })
        })
    )
}
