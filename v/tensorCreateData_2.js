require('dotenv').config()
const express = require('express')
const path = require('path')
const fs = require('fs')
const _path = path.join(__dirname, '')
const logger = require('morgan')
const app = express()
const request = require('request')
const axios = require('axios')
const cookieParser = require('cookie-parser')
const xml2js = require('xml2js')
const ExcelJS = require('exceljs')
const tf = require('@tensorflow/tfjs')

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
const sheet = workbook.addWorksheet('Sheet 1')
sheet.addRow(['isbn13', 'priceSales', 'salesPoint'])
const bestUrl = []
for (let i = 0; i < 20; i++) {
  bestUrl[
    i
  ] = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${Alkey}&QueryType=Bestseller&MaxResults=100&Cover=Big&start=${
    i + 1
  }&SearchTarget=Book&Version=20131101`
}
/* excel 최신화 시키는 function 2번째 ( api조회를 1000번 하기에 시간이 소요됨. ) */
api_read() // 2번

// isbn 혹은 isbn13코드로 api 호출해서 평점을 엑셀 4번 열에 저장하기
function api_read() {
  workbook.xlsx
    .readFile(excelFile)
    .then(() => {
      const sheet = workbook.getWorksheet('Sheet1')

      // API 데이터 가져오기
      async function fetchAndXml(url) {
        try {
          const response = await axios.get(url)
          const xmlData = response.data
          const result = await xml2js.parseStringPromise(xmlData)
          // console.log(result.object.item[0].subInfo[0].ratingInfo[0].ratingScore[0])
          const items =
            result.object.item[0].subInfo[0].ratingInfo[0].ratingScore[0]
          return items
        } catch (error) {
          console.error(`Error fetching data from API: ${error.message}`)
          return null
        }
      }

      // 각 셀에서 API 호출 및 데이터 쓰기
      async function processCells() {
        for (let rowNum = 2; rowNum <= sheet.rowCount; rowNum++) {
          // 첫 번째 행은 제목
          const row = sheet.getRow(rowNum)
          const data = row.getCell(1).value // row열의 첫번째 값 가져오기
          let apiUrl = ''
          data.indexOf('K') === 0
            ? (apiUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${Alkey}&ItemId=${data}&ItemIdType=ISBN&OptResult=bestSellerRank,ratingInfo&Version=20131101`)
            : (apiUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${Alkey}&ItemId=${data}&ItemIdType=ISBN13&OptResult=bestSellerRank,ratingInfo&Version=20131101`)

          if (apiUrl) {
            try {
              const items = await fetchAndXml(apiUrl)
              if (items) {
                row.getCell(4).value = items // 같은 셀에 데이터 쓰기
                console.log(`Data for Cell (${rowNum}, 4) processed`)
              }
            } catch (error) {
              console.error(
                `Error processing data for Cell (${rowNum}, 4): ${error.message}`
              )
            }
          }
        }

        // 수정된 엑셀 파일 저장
        workbook.xlsx
          .writeFile('updated_' + excelFile)
          .then(() => {
            console.log(`Updated Excel file saved!`)
          })
          .catch((writeErr) => {
            console.error('Error writing updated Excel file:', writeErr)
          })
      }

      processCells()
    })
    .catch((readErr) => {
      console.error('Error reading Excel file:', readErr)
    })
}

// 엑셀에서 텐서데이터(array)로 변환
// async function dataCreate() {
//   return workbook.xlsx
//     .readFile('updated_' + excelFile)
//     .then(() => {
//       const sheet = workbook.getWorksheet('Sheet1') // 시트 이름

//       const dataArray = []
//       // 각 행의 데이터를 배열로 저장
//       sheet.eachRow((row, rowNum) => {
//         if (rowNum !== 1) {
//           // 첫 번째 행은 제목일 경우 제외
//           const rowData = []
//           row.eachCell((cell) => {
//             rowData.push(Number(cell.value))
//           })
//           dataArray.push(rowData)
//         }
//       })
//       return dataArray
//     })
//     .catch((readErr) => {
//       console.error('Error reading Excel file:', readErr)
//     })
// }
// /* tensor 데이터 생성 */
// createTensor() // tensorflow 실행함수
// async function createTensor() {
//   const data = await dataCreate()
//   const xtensordata = data.map((v) => {
//     return [v[1], v[2]]
//   })
//   const ytensordata = data.map((v) => {
//     return v[3]
//   })
//   console.log(xtensordata)
//   tensorEdu(xtensordata, ytensordata)
// }

// /* tensor data 구성 및 예측시작 */
// async function tensorEdu(xevent, yevent) {
//   const x = xevent
//   const y = yevent
//   const xs = tf.tensor(x)
//   const ys = tf.tensor(y)

//   /* 2. 모델만들기 */
//   const xx = tf.input({ shape: [2] }) // 값 넣기
//   const layer1 = tf.layers
//     .dense({ units: 1000, activation: 'sigmoid' })
//     .apply(xx)
//   // const layer2 = tf.layers
//   //   .dense({ units: 50, activation: 'relu' })
//   //   .apply(layer1)
//   // const layer3 = tf.layers
//   //   .dense({ units: 25, activation: 'relu' })
//   //   .apply(layer2)
//   const yy = tf.layers.dense({ units: 1 }).apply(layer1)
//   const model = tf.model({ inputs: xx, outputs: yy })
//   const c_param = {
//     optimizer: tf.train.adam(),
//     loss: tf.losses.meanSquaredError
//   }
//   model.compile(c_param)
//   /* 3. 모델로 훈련 시작 */
//   const f_param = {
//     batchSize: 256,
//     epochs: 20,
//     callbacks: {
//       onEpochEnd: (e, l) => {
//         console.log('epoch : ', e, l, 'RMSE=>', Math.sqrt(l.loss))
//       }
//     }
//   }
//   let train = [[20000, 155648]]
//   await model.fit(xs, ys, f_param).then(async () => {
//     model.predict(tf.tensor(train)).print()
//     const savePath = 'file://' + 'c:/' + 'saved_model'

//     await model.save('my_custom_model')
//   })
// }
