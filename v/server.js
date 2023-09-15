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
const { Storage } = require('@google-cloud/storage')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
const iconv = require('iconv-lite')

const key = process.env.Book_api
const Bkey = process.env.booksKey
const Alkey = process.env.aladdin_api
const Alkey2 = process.env.aladdin_api2

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

app.post('/about', async (req, response) => {
  const book_isbn = req.body.scandata
  const url = `https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${key}&result_style=json&page_no=1&page_size=1&isbn=${book_isbn}`
  request(url, async (e, res, body) => {
    const send = JSON.parse(body)
    const data = send.docs[0]
    if (data === undefined) {
      const send_data = data
      response.send(send_data)
    } else {
      const tensorData = await QR_tensor(data.EA_ISBN)
      const send_data = {
        bookname: data.TITLE,
        img: tensorData.imgLink,
        price: data.PRE_PRICE,
        publisher: data.PUBLISHER,
        public_date: data.PUBLISH_PREDATE,
        author: data.AUTHOR,
        tensor: tensorData.data,
        rating: tensorData.rating
      }
      response.send(send_data)
    }
  })
})
load_url()
async function load_url(book_isbn) {
  try {
    const book = encodeURI('1%를 읽는 힘')
    console.log(book)
    let url = `https://www.yes24.com/Product/Search?domain=ALL&query=${book}`
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    let LinkUrl = ''

    // 이미지 태그를 선택하여 이미지 URL을 가져옴
    $(
      'ul#yesSchList li:first-child div.itemUnit div.item_info div.info_name a.gd_name'
    ).each((index, element) => {
      LinkUrl = $(element).attr('href')
      console.log(LinkUrl)
    })
    const text = await assitant(LinkUrl)
    console.log(text)
    // return LinkUrl
  } catch (error) {
    console.error('Error :', error)
    return
  }
}
async function assitant(event) {
  try {
    let url = `https://www.yes24.com${event}`
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    let text = ''

    $(
      'div#infoset_introduce div.infoSetCont_wrap div.infoWrap_txt div.infoWrap_txtInner'
    ).each((index, element) => {
      text = $(element).text()
    })
    return text
  } catch (error) {
    console.error('Error fetching images:', error)
    return
  }
}
async function kogpt_api(
  prompt,
  max_tokens = 1,
  temperature = 1.0,
  top_p = 1.0,
  n = 1
) {
  r = requests.post(
    'https://api.kakaobrain.com/v1/inference/kogpt/generation',
    (json = {
      prompt: prompt,
      max_tokens: max_tokens,
      temperature: temperature,
      top_p: top_p,
      n: n
    }),
    (headers = {
      Authorization: 'KakaoAK ' + REST_API_KEY,
      'Content-Type': 'application/json'
    })
  )
  // # 응답 JSON 형식으로 변환
  response = json.loads(r.content)
  return response
}
// 로그인 구현
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

// tensor 불러오기
async function tensorData(a, b) {
  try {
    const MODEL_URL = 'http://localhost:8080/my_custom_model.json'
    const model = await tf.loadLayersModel(MODEL_URL)
    const data = await model.predict(tf.tensor([[a, b]])).data()
    const send = Array.from(data)[0]
    return send
  } catch (error) {
    console.error('Model loading error:', error)
  }
}
// QR코드 로드시 예측할 값 불러오기
async function QR_tensor(data) {
  try {
    const url = `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${Alkey}&ItemId=${data}&ItemIdType=ISBN13&OptResult=bestSellerRank,ratingInfo&Version=20131101&Output=js&Cover=Big`
    // const url =
    //   'https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbqazwsx53811416001&ItemId=9791162244647&ItemIdType=ISBN13&OptResult=bestSellerRank,ratingInfo&Version=20131101&Output=js'
    return new Promise((resolve, reject) => {
      request(url, async (e, res, body) => {
        if (e) {
          reject(e)
        } else {
          const data = JSON.parse(body).item[0]
          const tensor = await tensorData(data.priceSales, data.salesPoint)
          resolve({
            data: tensor,
            imgLink: data.cover,
            rating: data.subInfo.ratingInfo.ratingScore
          })
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

/* 홈화면 서버구성 */
app.post('/homeBestseller', (req, res) => {
  const url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${Alkey2}&QueryType=Bestseller&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`

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
app.post('/hotBook', (req, res) => {
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
app.post('/realTime', (req, res) => {
  const url = 'https://www.yes24.com/main/default.aspx'
  axios
    .get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' })
    .then((response) => {
      const data = iconv.decode(response.data, 'euc-kr')
      const $ = cheerio.load(data)
      const rank = []
      $('span.txt').each(function () {
        rank.push($(this).text())
      })
      res.send(rank)
    })
})

app.post('/getBook', (req, res) => {
  const url = `
  https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${Alkey2}&QueryType=ItemNewAll&MaxResults=20&start=1&SearchTarget=Book&output=js&Version=20131101&Cover=Big&CategoryId=${req.body.ID}`
  request.get(url, (e, response, body) => {
    const data = JSON.parse(body).item
    const title = data.map((v) => {
      return v.title
    })
    const author = data.map((v) => {
      return v.author
    })
    const img = data.map((v) => {
      return v.cover
    })
    const link = data.map((v) => {
      return v.link
    })
    res.send({ title, author, img, link })
  })
})

/* ================================================================================== */
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
  console.log(`[Server] listening on port 3000`)
})

/** ===================사용안함=================== */
/* tensorflow model upload */
const storage = new Storage({
  projectId: 'atomic-box-397600',
  keyFilename: 'D:/tensorProject/v/atomic-box-397600-445e9d0ea33c.json' // 인증 정보 파일 경로
})
const bucketName = 'tensor_qazwsx5381' // 클라우드 스토리지 버킷 이름
const modelPath = 'my_custom_model.json'

async function uploadFile(filePath, destinationFileName) {
  try {
    const bucket = storage.bucket(bucketName)
    const options = {
      destination: destinationFileName, // 업로드할 파일의 저장 경로
      metadata: {
        cacheControl: 'public, max-age=31536000' // 메타데이터 설정
      }
    }

    await bucket.upload(filePath, options)
    console.log(`${filePath} uploaded to ${bucketName}/${destinationFileName}`)
  } catch (error) {
    console.error('Upload error:', error)
  }
}

async function loadModelFromGCS() {
  try {
    const bucket = storage.bucket(bucketName)
    const blob = bucket.file(modelPath)

    // 모델 파일을 로컬 임시 디렉토리로 다운로드
    const tempLocalFilePath = '/model.json' // 로컬 임시 디렉토리 경로
    await blob.download({ destination: tempLocalFilePath })

    // 다운로드한 모델을 로드
    fetch(MODEL_URL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error('Fetch error:', error)
      })
    const model = await tf.loadLayersModel(`file://${tempLocalFilePath}`)
    console.log('Model loaded from Google Cloud Storage:', model.summary())
  } catch (error) {
    console.error('Model loading error:', error)
  }
}
// const filePath = 'D:/tensorProject/v/my_custom_model.json' // 업로드할 파일 경로
// const destinationFileName = 'my_custom_model.json' // 클라우드 스토리지에 저장할 파일 이름
const filePath = 'D:/tensorProject/v/my_custom_model.weights.bin' // 업로드할 파일 경로
const destinationFileName = 'my_custom_model.weights.bin' // 클라우드 스토리지에 저장할 파일 이름

/** tensorflow 저장함수 */
// uploadFile(filePath, destinationFileName)

/** 모델 불러오기 */
// loadModelFromGCS()

// const tfnode = require('@tensorflow/tfjs-node')

async function tensor12() {
  const MODEL_URL =
    'https://storage.googleapis.com/tensor_qazwsx5381/my_custom_model.json'
  const BIN_URL =
    'https://storage.googleapis.com/tensor_qazwsx5381/my_custom_model.weights.bin'
  // const MODEL_URL = 'http://localhost:8080/my_custom_model.json'
  // const BIN_URL = 'http://localhost:8080/my_custom_model_weights.bin'
  Promise.all([
    fetch(MODEL_URL).then((response) => response.json()),
    fetch(BIN_URL).then((response) => response.arrayBuffer())
  ])
    .then(async ([modelJson, modelBinBuffer]) => {
      const model = await tf.loadLayersModel(
        tf.io.fromMemory(modelJson),
        tf.io.fromMemory(modelBinBuffer)
      )

      // 예측에 사용할 입력 데이터 설정
      const inputTensor = tf.tensor([[19800, 50000]]) // 예시 입력 데이터

      // 예측 수행
      const prediction = model.predict(inputTensor)

      // 예측 결과 출력
      prediction.print()
    })
    .catch((error) => {
      console.error('Fetch error:', error)
    })
}
// tensor12()
