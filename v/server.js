require('dotenv').config()
const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')
const _path = path.join(__dirname, './dist')
const logger = require('morgan')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const axios = require('axios')
const { mycol, myboard } = require('./mongo_setting')
const cookieParser = require('cookie-parser')
const CryptoJS = require('crypto-js')
const parseString = require('xml2js').parseString
const xml2js = require('xml2js')
const ExcelJS = require('exceljs')
const tf = require('@tensorflow/tfjs')

const key = process.env.Book_api
const Bkey = process.env.booksKey
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

app.post('/about', (req, response) => {
  const book_isbn = req.body.scandata
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

app.post('/', async (req, response) => {
  try {
    const data = req.body
    // 회원가입
    if (data.name && data.mail) {
      main(data)
      response.send('succese')
    }
    // 로그인(쿠키생성)
    else if (data.pw && data.id) {
      login(data).then((res) => {
        if (res[0] === undefined) {
          return response.send('error')
        }
        const pw = CryptoJS.AES.decrypt(res[0].pw, res[0].id)
        const pw_1 = pw.toString(CryptoJS.enc.Utf8)
        if (data.pw != pw_1) {
          response.send('error')
        } else {
          response.cookie(res[0].id, res[0].name, {
            maxAge: 3600000
          })
          response.send({ id: res[0].id, name: res[0].name })
        }
      })
    }
    // 아이디 중복학인
    else if (data.id) {
      check(data).then((res) => {
        if (res.length === 1) {
          response.send('NO')
        } else {
          response.send('OK')
        }
      })
    }
    // 로그아웃
    else if (data.loginID) {
      logout(data.loginID).then((res) => {
        response.cookie(res[0].id, res[0].name, {
          maxAge: 0
        })
        response.send('logout')
      })
    }
  } catch (error) {
    console.log(error)
  }
})

// 이미지 가져오기
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

// 회원가입 정보 저장
async function main(event) {
  try {
    const _data = {
      id: event.id,
      pw: CryptoJS.AES.encrypt(event.pw, event.id).toString(),
      // CryptoJS.AES.encrypt('my message', 'secret key 123').toString()
      name: event.name,
      mail: event.mail
    }
    const CRUD_C = new mycol(_data)
    const t = await CRUD_C.save()
    console.log(t)
  } catch (error) {
    console.error
  }
}
// ID 중복체크
async function check(event) {
  try {
    const t = await mycol
      .find(
        {
          id: event.id
        },
        { _id: 0, __v: 0 }
      )
      .lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}
// 로그인
async function login(event) {
  try {
    const t = await mycol
      .find(
        {
          id: event.id
        },
        { _id: 0, __v: 0 }
      )
      .lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}
// 로그아웃
async function logout(event) {
  try {
    const t = await mycol
      .find(
        {
          id: event
        },
        { _id: 0, __v: 0 }
      )
      .lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}
// 게시글 저장
async function board_save(event, count) {
  try {
    const _data = {
      id: event.id,
      name: event.name,
      title: event.title,
      content: event.content,
      date: event.date,
      edit_date: event.edit_date ? event.edit_date : '',
      load_count: 0,
      boardnum: count
    }
    const board = new myboard(_data)
    await board.save()
  } catch (error) {
    console.error
  }
}

// 게시글 조회
async function board_load() {
  try {
    const t = await myboard
      .find({}, { _id: 0, __v: 0 })
      .sort({ date: -1 })
      .lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}
// 게시글 검색
async function load(e) {
  try {
    const t = await myboard
      .find({ id: e.id, name: e.name, date: e.date }, { _id: 0, __v: 0 })
      .lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}
// 게시글 검색(글 번호로)
async function loadNum(e) {
  try {
    const t = await myboard.find({ boardnum: e }, { _id: 0, __v: 0 }).lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}

// 게시물 조회수 저장
async function loadContent(event) {
  try {
    const t = await load(event)
    const number = t[0].load_count + 1
    await myboard.updateOne(
      { id: event.id, name: event.name, date: event.date },
      { $set: { load_count: number } }
    )
    const t_1 = await myboard
      .find(
        { id: event.id, name: event.name, date: event.date },
        { _id: 0, __v: 0 }
      )
      .lean() // p349 설명 효율적 메소드
    return t_1
  } catch (error) {
    console.error
  }
}
// 게시글 끝번호 조회
async function loadCount() {
  try {
    const t = await myboard.find({}, { _id: 0, __v: 0 }).lean() // p349 설명 효율적 메소드
    return t
  } catch (error) {
    console.error
  }
}
let count = ''
app.post('/board', async (req, res) => {
  const data = req.body
  const boardNum = await loadCount()
  if (boardNum.length === 0) {
    count = 1
  } else if (boardNum.length >= boardNum[boardNum.length - 1].boardnum) {
    count = boardNum.length + 1
  } else {
    count = boardNum[boardNum.length - 1].boardnum + 1
  }
  await board_save(data, count).then(() => {
    res.send('succese')
  })
})
// 게시글 삭제
async function delContent(event) {
  try {
    await myboard.findOneAndDelete({ boardnum: event })
    const t_1 = await myboard
      .find(
        { id: event.id, name: event.name, date: event.date },
        { _id: 0, __v: 0 }
      )
      .lean() // p349 설명 효율적 메소드
    return t_1
  } catch (error) {
    console.error
  }
}
// 게시글 수정
async function editContent(event) {
  try {
    await myboard.findOneAndUpdate(
      { boardnum: event.boardnum },
      {
        $set: {
          title: event.title,
          content: event.content
        }
      }
    )
    const t_1 = await myboard
      .find({ boardnum: event.boardnum }, { _id: 0, __v: 0 })
      .lean() // p349 설명 효율적 메소드
    return t_1
  } catch (error) {
    console.error
  }
}

async function editDB(event) {
  try {
    const t_1 = await myboard
      .find({ boardnum: event }, { _id: 0, __v: 0 })
      .lean() // p349 설명 효율적 메소드
    return t_1
  } catch (error) {
    console.error
  }
}
app.post('/board_load', (req, res) => {
  board_load().then((data) => {
    res.send(data)
  })
})

app.post('/load_content', async (req, res) => {
  const data = req.body
  const count = await loadContent(data)
  res.send(count)
})
app.post('/delete', async (req, res) => {
  const data = req.body
  console.log(data)
  await delContent(data.count)
  res.send('del')
})

app.post('/edit', async (req, res) => {
  const data = req.body
  const send = await editDB(data.boardnum)
  res.send(send)
})

app.post('/editBoard', async (req, res) => {
  const data = req.body
  const send = await editContent(data)
  res.send(send)
})

app.post('/editcancel', async (req, res) => {
  const data = req.body.count
  const send = await loadNum(data)
  res.send(send)
})

// 서점 위치 불러오기
app.post('/BstoreInfo', (req, response) => {
  const loc = req.body
  const Bookurl = `http://api.kcisa.kr/API_CNV_045/request?serviceKey=${Bkey}&numOfRows=417`
  request.get(Bookurl, (e, res, body) => {
    parseString(body, async (err, result) => {
      const bookstore = result.response.body[0].items[0].item
      const store_array = await bookstore.map((v, i) => {
        return { lat: Number(v.FCLTY_LA[0]), lon: Number(v.FCLTY_LO[0]) }
      })
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371 // 지구 반경 (단위: km)
        const dLat = (lat2 - lat1) * (Math.PI / 180)
        const dLon = (lon2 - lon1) * (Math.PI / 180)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = R * c // 거리 (단위: km)
        return distance
      }
      const nearestLocations = store_array
        .map((location) => ({
          location,
          distance: calculateDistance(
            loc.lat,
            loc.lon,
            location.lat,
            location.lon
          )
        }))
        .sort((a, b) => a.distance - b.distance)
      const nearLocation = nearestLocations.slice(undefined, 5)
      const result_array = []
      for (let j = 0; j < 5; j++) {
        bookstore.forEach((v, i) => {
          if (
            nearLocation[j].location.lat === Number(v.FCLTY_LA[0]) &&
            nearLocation[j].location.lon === Number(v.FCLTY_LO[0])
          )
            result_array.push(v)
        })
      }
      const resul = result_array.slice(undefined, 5)
      response.send(resul)
    })
  })
})

// 추천도서 조회
app.post('/bestseller', (req, response) => {
  const bookurl = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${Alkey}&QueryType=ItemNewSpecial&MaxResults=10&Cover=Big&start=1&SearchTarget=Book&output=js&Version=20131101`
  request.get(bookurl, (e, res, body) => {
    const data = JSON.parse(body).item
    response.send(data)
  })
})

// 신간 조회
app.post('/NewBooks', (req, res) => {
  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${Alkey}&QueryType=ItemNewAll&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`
  request(url, (error, response, body) => {
    if (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }
    res.send(body)
  })
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

/* excel 최신화 시키는 function ( 순서대로 실행하기 / api조회를 1000번 하기에 시간이 소요됨. ) */
// fetchAndSaveData() // 1번
// api_read() // 2번

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
            const items = result.object.item

            items.forEach((item, i) => {
              sheet.addRow([
                item.isbn13[0],
                item.priceSales[0],
                item.salesPoint[0]
              ])
            })

            resolve()
          })
        })
    )
}

// isbn13코드로 api 호출해서 평점을 엑셀 4번 열에 저장하기
function api_read() {
  workbook.xlsx
    .readFile(excelFile)
    .then(() => {
      const sheet = workbook.getWorksheet('Sheet 1')

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
          const apiUrl = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${Alkey}&ItemId=${data}&ItemIdType=ISBN13&OptResult=bestSellerRank,ratingInfo&Version=20131101` // 각 셀에 있는 값을 가져오기

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
async function dataCreate() {
  return workbook.xlsx
    .readFile('updated_' + excelFile)
    .then(() => {
      const sheet = workbook.getWorksheet('Sheet 1') // 시트 이름

      const dataArray = []
      // 각 행의 데이터를 배열로 저장
      sheet.eachRow((row, rowNum) => {
        if (rowNum !== 1) {
          // 첫 번째 행은 제목일 경우 제외
          const rowData = []
          row.eachCell((cell) => {
            rowData.push(Number(cell.value))
          })
          dataArray.push(rowData)
        }
      })
      return dataArray
    })
    .catch((readErr) => {
      console.error('Error reading Excel file:', readErr)
    })
}
/* tensor 데이터 생성 */
;(async () => {
  const data = await dataCreate()
  const tensordata = data.map((v) => {
    return [v[1], v[2], v[3]]
  })
  // console.log(tensordata)
})()

// http 서버 열기
app.listen(8080, () => {
  console.log('서버 open')
})

// https 인증서 설정 (정식으로 만든 인증서가 아니라서 유효하지 않은 인증서로 인식)
const getSSLOptions = {
  key: fs.readFileSync(path.resolve('./private.pem')),
  cert: fs.readFileSync(path.resolve('./public.pem'))
}

// https 서버 열기
https.createServer(getSSLOptions, app).listen(3000, () => {
  console.log(`[Server] listening on port 8080`)
})
