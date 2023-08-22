<template>
  <section>
    <h3>가장 가까운 서점</h3>
    <div id="container">
      <div id="map">지도위치</div>
      <p id="text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quasi
        libero, asperiores doloribus vel soluta, a eligendi animi pariatur ea
        beatae! Autem exercitationem aut laborum illum eum quia totam!
        Veritatis.
      </p>
    </div>
  </section>
</template>
<script>
// require('dovenv').config()
export default {
  mounted() {
    // const gpsx = 35.195569
    // const gpsy = 129.075102
    const mapContainer = document.getElementById('map')
    const script = document.createElement('script')
    script.src =
      // 'http://api.kcisa.kr/API_CNV_045/request?serviceKey=ca5c055a-8dc5-4788-8049-31ca2e238cd3'
      // 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=cb00c7966b9e945687b4ffee1da8ea51&autoload=false'
      'https://dapi.kakao.com/v2/maps/sdk.js?appkey=cb00c7966b9e945687b4ffee1da8ea51&libraries=services'
    script.onload = () => {
      window.kakao.maps.load(() => {
        // const location = 'http://api.kcisa.kr/API_CNV_045/request'
        const mapOptions = {
          center: new window.kakao.maps.LatLng(35.195569, 129.075102), // 지도의 중심
          level: 4
        }

        const map = new window.kakao.maps.Map(mapContainer, mapOptions)

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = 35.195569 // position.coords.latitude // 마커위치
            const lon = 129.075102 // position.coords.longitude // 마커위치
            const locPosition = new window.kakao.maps.LatLng(lat, lon)
            const message = '<div>여기가 현재위치</div>'
            this.displayMarker(map, locPosition, message)
          })
        } else {
          alert(
            '이 문장은 사용상의 웹 브라우저가 Geolocation API를 지원하지 않을 때 나타납니다.'
          )
        }
      })
    }

    document.body.appendChild(script)
  },

  methods: {
    displayMarker(map, locPosition, message) {
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition
      })
      const iwContent = message
      const iwRemovable = true
      const infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemovable
      })

      infowindow.open(map, marker)
      map.setCenter(locPosition)
    }
  }
}
</script>
<style scoped>
#container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#map {
  width: 900px;
  height: 500px;
  border: 1px solid black;
}
</style>
위 코드에서 수정한 내용은 다음과 같습니다:
<style scoped>
#container {
  width: 100%;
  height: auto;
  /* background-color: black; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#map {
  width: 900px;
  height: 500px;
  border: 1px solid black;
}

#text {
  width: 900px;
  height: 150px;
  border: 1px solid black;
}
</style>
