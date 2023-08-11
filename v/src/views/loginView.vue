<template>
  <div>
    <button @click="check(message)">확인하기</button>
    <div>test</div>
    <div>{{ message }}</div>
    <div>{{ cookie }}</div>
  </div>
</template>
<script>
export default {
  props: {
    message: String
  },
  data() {
    return {
      cookie: ''
    }
  },
  methods: {
    check(event) {
      console.log(decodeURIComponent(this.getCookieValue(event)))
    },
    getCookieValue(cookieName) {
      const cookieArray = document.cookie.split(';') // 쿠키 문자열을 세미콜론으로 분리하여 배열로 변환
      console.log(cookieArray)

      for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim() // 쿠키 문자열의 앞뒤 공백 제거
        if (cookie.startsWith(cookieName + '=')) {
          return cookie.substring(cookieName.length + 1) // 쿠키 이름과 '='를 제외한 값 반환
        }
      }

      return null // 해당하는 쿠키를 찾지 못한 경우
    }
  }
}
</script>
<style></style>
