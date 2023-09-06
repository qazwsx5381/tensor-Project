<template>
  <section>
    <h3>
      가장 가까운 서점
      <button class="location" @click="displayInfoWindow()">현재위치</button>
    </h3>
    <div id="container">
      <div id="map">지도위치</div>
      <div v-if="load_location" id="text">
        <div v-for="(v, i) in store_location" :key="i">
          <div class="location">
            <div class="store_line">
              <span class="storeContent">{{ i + 1 }}. {{ v.FCLTY_NM[0] }}</span>
            </div>
            <div class="store_line">
              <span class="storeContent">{{ v.FCLTY_ROAD_NM_ADDR[0] }}</span>
            </div>
            <div class="store_line">
              <span class="storeContent">{{ v.OPTN_DC[0] }}</span>
            </div>
            <div class="store_line" v-if="v.RSTDE_GUID_CN[0]">
              <span class="storeContent">{{ v.RSTDE_GUID_CN[0] }}</span>
            </div>
            <div id="store_line">
              <span class="storeContent"
                ><button @click="displayInfo(v.FCLTY_LA, v.FCLTY_LO)">
                  위치찾기
                </button></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="selection">
      <h3 class="location">임의 위치</h3>
      <!-- <select name="" id="location" onchange="console.log(this.value)"> -->
      <select name="location" id="location" v-model="selectedLocation">
        <option value="" disabled selected>역을 선택하세요</option>
        <option value="35.1699, 129.1329">센텀시티</option>
        <option value="37.5546, 126.9716">서울역</option>
        <option value="36.3324, 127.4342">대전역</option>
        <option value="35.115, 129.0412">부산역</option>
      </select>
      <button class="location" @click="displayIn(sel_let, sel_lon)">
        선택한 위치
      </button>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      latitude: '',
      longitude: '',
      Newlatitude: '',
      Newlongitude: '',
      textContent: '',
      infowindow: null,
      load_location: false,
      iwPosition: '',
      lat: '',
      lon: '',
      sel_lat: '',
      sel_lon: '',
      store_location: '',
      selectedLocation: '',
      markers: []
    }
  },
  watch: {
    selectedLocation: function (value) {
      if (value) {
        const [lat, lon] = value.split(', ')
        this.sel_let = parseFloat(lat)
        this.sel_lon = parseFloat(lon)
        this.displayIn(this.sel_let, this.sel_lon)
      }
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap()
    } else {
      const script = document.createElement('script')
      /* global kakao */
      this.geofind()
      script.onload = () => kakao.maps.load(this.initMap)
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=272695eface2e5a0142e6434ba2323e6'
      document.head.appendChild(script)
    }
  },

  methods: {
    initMap() {
      const container = document.getElementById('map')
      const options = {
        center: new kakao.maps.LatLng(this.latitude, this.longitude),
        level: 5
      }
      // 지도 객체를 등록합니다.
      // 지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options)
      this.displayInfoWindow()
    },
    displayInfoWindow() {
      if (this.infowindow && this.infowindow.getMap()) {
        // 이미 생성한 인포윈도우가 있기 때문에 지도 중심좌표를 인포윈도우 좌표로 이동시킨다.
        this.map.setCenter(this.infowindow.getPosition())
        return
      }
      const iwContent = '<div id="point" style="padding:5px;">현재 위치!</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      const iwPosition = new kakao.maps.LatLng(this.latitude, this.longitude) // 인포윈도우 표시 위치입니다
      const iwRemoveable = true // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      if (this.infowindow && this.infowindow.getMap()) {
        // 이미 생성한 인포윈도우가 있으면 닫기
        this.infowindow.close()
      }

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable
      })

      this.map.setCenter(iwPosition)
      this.store()

      setTimeout(() => {
        this.infowindow.close()
      }, 3000) // 시간을 밀리초 단위로 설정
    },
    geofind() {
      if (!('geolocation' in navigator)) {
        this.textContent = 'Geolocation is not available.'
        return
      }
      this.textContent = 'Locating...!'

      // get position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.latitude = pos.coords.latitude
          this.longitude = pos.coords.longitude
          // this.latitude = 35.15253
          // this.longitude = 129.059852
        },
        (err) => {
          this.textContent = err.message
        }
      )
    },
    displayInfo(lat, lon) {
      const iwContent = '<div id="point" style="padding:5px;">서점 위치!</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      const iwPosition = new kakao.maps.LatLng(lat, lon) // 인포윈도우 표시 위치입니다
      const iwRemoveable = true // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      if (this.infowindow && this.infowindow.getMap()) {
        // 이미 생성한 인포윈도우가 있으면 닫기
        this.infowindow.close()
      }

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable
      })

      this.map.setCenter(iwPosition)
      setTimeout(() => {
        this.infowindow.close()
      }, 1500) // 초를 밀리초 단위로 설정
    },
    store(lat = this.latitude, lon = this.longitude) {
      axios.post('/BstoreInfo', { lat: lat, lon: lon }).then((res) => {
        this.store_location = res.data
        this.load_location = true
      })
    },
    displayIn(lat, lon) {
      console.log(lat, lon)
      const iwContent =
        '<div id="point" style="padding:5px;">새로운 위치!</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      const iwPosition = new kakao.maps.LatLng(lat, lon) // 인포윈도우 표시 위치입니다
      const iwRemoveable = true // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      if (this.infowindow && this.infowindow.getMap()) {
        // 이미 생성한 인포윈도우가 있으면 닫기
        this.infowindow.close()
      }

      this.infowindow = new kakao.maps.InfoWindow({
        map: this.map, // 인포윈도우가 표시될 지도
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable
      })

      this.map.setCenter(iwPosition)
      this.store(lat, lon)
      setTimeout(() => {
        this.infowindow.close()
      }, 1500) // 초를 밀리초 단위로 설정
    }
  }
}
</script>
<style scoped>
#container {
  width: 100%;
  height: auto;
  /* background-color: black; */
  display: flex;
  justify-content: center;
  align-items: center;
}

#map {
  width: 400px;
  height: 600px;
  border: 1px solid black;
}

#text {
  width: 450px;
  height: auto;
}

div.location {
  display: flex;
  align-items: start;
  flex-direction: column;
  color: #817135;
  background-color: #f5e9a6;
  border-color: #cfc79d;
  border-left-width: 20px;
  border-radius: 5px;
  padding: 15px;
  border-left-style: solid;
  font-size: 0.9rem;
  margin-bottom: 10px;
  margin-left: 20px;
  width: 450px;
}
button {
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 15px;
  margin: 2px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  font-family: 'omyu_pretty';
}

div#store_line button {
  width: 100px;
  height: 30px;
  border: 1px solid #cfc79d;
  border-radius: 5px;
  background-color: #cfc79d;
  color: white;
  font-size: 15px;
  margin-top: 5px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  font-family: 'omyu_pretty';
}

button:hover {
  background-color: #dfdfdf;
  color: black;
}

div#store_line button:hover {
  background-color: #dfdfdf;
  color: black;
}
div.selection {
  display: flex;
  justify-content: center;
  align-items: center;
}
h3.location {
  margin-right: 20px;
  font-size: 20px;
}
select#location {
  width: 130px;
  height: 30px;
  margin-right: 15px;
}
</style>
