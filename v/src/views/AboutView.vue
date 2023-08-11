<template>
  <div>
    <h1>Barcode Scanner</h1>
    <button @click="startScanner()">
      <img src="./icon.svg" alt="코드 아이콘" />
    </button>
    <div>
      <div id="scanner"></div>
    </div>
    <div id="error" v-if="error">
      <div>{{ error_msg }}</div>
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
      error: false,
      title: '',
      author: '',
      price: '',
      publisher: '',
      publis_date: '',
      error_msg: '',
      price_link: '',
      img_src: './no_img.png'
    }
  },
  methods: {
    startScanner() {
      this.test = false
      this.error = false
      const scan = document.getElementById('scanner')
      scan.style.width = '100%'
      scan.style.height = '500px'
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
            return
          }
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
            const data = JSON.parse(res.request.response)
            this.title = data.bookname
            this.author = data.author
            this.price = data.price
            this.publisher = data.publisher
            this.publis_date = data.public_date
            this.price_link =
              'https://www.bookprice.co.kr/compare.jsp?isbn=' + e
            if (data.img.length === 1) {
              this.img_src = data.img[0]
            } else {
              this.img_src =
                'http://www.myeongin.net/app/dubu_board/docs/imgs/d/lg_d16124045780126_%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%A4%80%EB%B9%84%EC%A4%91.jpg'
            }
          }
        })
    }
  }
}
</script>
<style scoped>
button {
  border: none;
}
#result {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

#result_txt {
  margin-right: 200px;
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
}
</style>
