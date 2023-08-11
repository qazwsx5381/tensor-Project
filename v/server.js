require('dotenv').config()
const express = require('express')
const path = require('path')
const _path = path.join(__dirname, './dist')
const logger = require('morgan')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const axios = require('axios')
const mycol = require('./mongo_ori')
const cookieParser = require('cookie-parser')
const CryptoJS = require('crypto-js')

const key = process.env.Book_api

/* post를 위한 구문 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
/* 스태딕 경로 */
app.use('/', express.static(_path))
/* 로그 정보(최소화 해서 표현) */
app.use(logger('tiny'))
app.use(cookieParser())

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

app.post('/', (req, response) => {
  const data = req.body
  // 회원가입
  if (data.name && data.mail) {
    main(data)
    response.send('succese')
  }
  // 로그인(쿠키생성)
  else if (data.pw && data.id) {
    login(data).then((res) => {
      // console.log(res[0].pw, data.pw)
      const pw = CryptoJS.AES.decrypt(res[0].pw, res[0].id)
      const pw_1 = pw.toString(CryptoJS.enc.Utf8)
      console.log(pw_1)
      if (res[0] === undefined || data.pw != pw_1) {
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
        maxAge: 0,
        httpOnly: true
      })
      response.send('logout')
    })
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

app.listen(3000, () => {
  console.log('서버 open')
})
