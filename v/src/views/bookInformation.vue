<template>
  <div id="cam">
    <h1>Barcode Scanner</h1>
    <button class="barcode_btn" @click="startScanner()" v-if="show_btn">
      <img
        id="barcode_btn"
        src="./icon.svg"
        alt="코드 아이콘"
        v-if="show_btn"
      />
    </button>
    <div>
      <div id="scanner"></div>
      <button v-if="close_cam" class="image" @click="closeScan()">
        <img
          v-if="close_cam"
          id="log_close_btn"
          src="../assets/close.svg"
          alt="닫기"
          title="닫기"
        />
      </button>
    </div>
    <div id="result" v-if="test">
      <img
        id="load_image"
        :src="img_src"
        alt=""
        style="width: 150px; height: 205px"
      />
      <div id="result_txt">
        <div id="result_title">
          <span class="list">제목</span
          ><span class="list_text">{{ title }}</span>
        </div>
        <div id="result_author">
          <span class="list">저자</span
          ><span class="list_text">{{ author }}</span>
        </div>
        <div id="result_price">
          <span class="list">출간가격</span
          ><span class="list_text">{{ price }}</span>
        </div>
        <div id="result_publisher">
          <span class="list">출판사</span
          ><span class="list_text">{{ publisher }}</span>
        </div>
        <div id="result_public_date">
          <span class="list">출간일자</span
          ><span class="list_text">{{ publis_date }}</span>
        </div>
        <div id="result_link">
          <span class="list">가격</span>
          <span class="list_text" id="price_info"
            ><a
              id="link"
              :href="price_link"
              target="_blank"
              title="누르면 북프라이스로 연결됩니다."
              >가격정보</a
            ></span
          >
        </div>
        <div class="rating">
          <span class="list">실제평점</span>
          <div class="list_text">
            <span
              v-for="star in 5"
              :key="star"
              :class="['star', star <= ratingscore / 2 ? 'filled' : '']"
            >
              ★
            </span>
          </div>
        </div>
        <div class="rating">
          <span class="list">예측평점</span>
          <div class="list_text">
            <span
              v-for="star in 5"
              :key="star"
              :class="['star', star <= score / 2 ? 'filled' : '']"
            >
              ★
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Quagga from 'quagga'
import axios from 'axios'
export default {
  data() {
    return {
      control: false,
      test: false,
      show_btn: true,
      close_cam: false,
      title: '',
      author: '',
      price: '',
      publisher: '',
      publis_date: '',
      error_msg: '',
      price_link: '',
      score: '',
      ratingscore: '',
      img_src: './no_img.png'
    }
  },
  methods: {
    startScanner() {
      this.test = false
      this.show_btn = false
      const scan = document.getElementById('scanner')
      scan.style.width = '100%'
      scan.style.height = '480px'
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: scan,
            constraints: {
              facingMode: 'environment' // 후면 카메라 사용 (필요에 따라 조정 가능)
            }
          },
          decoder: {
            readers: [
              'ean_reader',
              'code_128_reader',
              'code_39_reader',
              'upc_reader',
              'codabar_reader'
            ]
          }
        },
        (err) => {
          if (err) {
            console.error('Error initializing Quagga:', err)
            this.closeScan()
            return alert('카메라가 인식되지 않았습니다.')
          }
          this.videoPosition()
          console.log('Quagga initialization succeeded!')
          Quagga.start()
          Quagga.onDetected(this.onBarcodeDetected)
        }
      )
    },
    stopScanner() {
      const scan = document.getElementById('scanner')
      scan.style.width = '0'
      scan.style.height = '0'
      scan.innerHTML = ''
      this.show_btn = true
      this.close_cam = false
      Quagga.stop()
    },
    onBarcodeDetected(result) {
      this.stopScanner()
      const code = result.codeResult.code
      this.search(code)
    },
    search(e) {
      axios
        .post('/about', {
          scandata: e
        })
        .then((res) => {
          if (res.request.response === '') {
            this.error = true
            this.error_msg = '도서 바코드가 아닙니다. 다시 인식해주세요!'
          } else {
            this.test = true
            this.show_btn = true
            const data = JSON.parse(res.request.response)
            this.title = data.bookname
            this.author = data.author
            this.price = data.price
            this.publisher = data.publisher
            this.publis_date = data.public_date
            this.score = data.tensor
            this.ratingscore = data.rating
            this.price_link =
              'https://www.bookprice.co.kr/compare.jsp?isbn=' + e
            if (data.img) {
              this.img_src = data.img
            } else {
              this.img_src =
                'http://www.myeongin.net/app/dubu_board/docs/imgs/d/lg_d16124045780126_%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%A4%80%EB%B9%84%EC%A4%91.jpg'
            }
          }
        })
    },
    closeScan() {
      const scan = document.getElementById('scanner')
      scan.style.width = '0'
      scan.style.height = '0'
      scan.innerHTML = ''
      this.show_btn = true
      this.close_cam = false
    },
    videoPosition() {
      const video = document.querySelector('div#scanner video')
      video.style.position = 'absolute'
      this.close_cam = true
    }
  }
}
</script>
<style scoped>
#cam {
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444;
  font-family: 'omyu_pretty';
  font-size: 20px;
}
button {
  border: none;
}
button.barcode_btn {
  display: relative;
  width: 48px;
  height: 48px;
}
#result {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  align-items: center;
}

#result_txt {
  margin-left: 20px;
}

#result_title,
#result_author,
#result_price,
#result_publisher,
#result_public_date,
#result_link {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* 책 내용 정리 */

img#load_image {
  border: 1px solid black;
  box-shadow: 1px 1px 5px gray;
  margin-right: 50px;
}
.list {
  width: 200px;
  font-weight: bolder;
  font-size: large;
  display: flex;
  align-items: center;
  margin: 5px 0;
}
.list_text {
  width: 70%;
  margin: 5px 0;
  vertical-align: middle;
  height: 24px;
}

img#log_close_btn {
  position: relative;
  left: 285px;
  top: -475px;
  background-color: white;
  border: 5px outset #d1d1d1cc;
}
img#log_close_btn:hover {
  border: 5px inset #d1d1d1cc;
}

button.barcode_btn {
  width: 60px;
  height: 48px;
  margin: 0 auto 10px auto;
}
.rating {
  font-size: 24px;
  display: flex;
}

.star {
  display: inline-block;
  width: 24px; /* 별의 크기를 정사각형으로 조절 */
  height: 24px;
  color: #ccc;
  transition: color 0.3s;
  position: relative;
  top: -7px;
}

.filled {
  color: gold;
}
</style>
