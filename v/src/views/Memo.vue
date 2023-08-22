<template>
  <div id="container" v-if="login_id">
    <h3>정보를 공유해 주세요.</h3>
    <div id="memoContainer">
      <div>
        <span class="text">제목</span>
        <input type="text" id="title" v-model="title" />
      </div>
      <div>
        <span class="text">내용</span>
        <textarea
          name=""
          id="textarea"
          cols="30"
          rows="10"
          v-model="content"
        ></textarea>
      </div>
      <div id="buttonContainer">
        <button id="ok" @click="addMemo()">등록</button>
        <button id="delete" @click="routerLink()">취소</button>
      </div>
    </div>
  </div>
  <div v-else>
    <h3>로그인 해주세요.</h3>
  </div>
</template>
<script>
import bookCommunity from './bookCommunity.vue'
import axios from 'axios'
export default {
  views: {
    bookCommunity
  },
  data() {
    return {
      isCookieSet: false,
      login_id: '',
      login_name: '',
      title: '',
      content: ''
    }
  },
  created() {
    this.checkCookieStatus() // 컴포넌트가 생성되면서 초기 확인 실행
    setInterval(this.checkCookieStatus, 500)
  },
  methods: {
    routerLink() {
      this.$router.push('/bookCommunity')
    },
    addMemo() {
      const content = {
        id: this.login_id,
        name: this.login_name,
        title: this.title,
        content: this.content,
        date: new Date(),
        boardnum: ''
      }
      axios.post('/board', content).then((res) => {
        alert('저장되었습니다.')
        this.title = ''
        this.content = ''
        this.$router.push('/bookCommunity')
      })
    },
    checkCookieStatus() {
      this.isCookieSet = document.cookie
      const cookie = document.cookie.split('=')
      this.login_id = document.cookie ? cookie[0] : ''
      this.login_name = document.cookie ? cookie[1] : ''
    }
  }
}
</script>
<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

input {
  margin: 5px;
}
#memoContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-family: 'omyu_pretty';
}
#memoContainer div {
  display: flex;
}
span.text {
  width: 150px;
  margin-bottom: 20px;
  line-height: 33px;
  text-align: right;
  margin-right: 15px;
}
#title {
  width: 600px;
  height: 30px;
  font-family: 'omyu_pretty';
  font-size: 20px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 1px solid black;
}

#textarea {
  width: 600px;
  height: 300px;
  font-size: 20px;
  resize: none;
  font-family: 'omyu_pretty';
  border: none;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
}

#title:focus {
  outline-style: none;
  border-bottom: 1px solid black;
}
#textarea:focus {
  outline-style: none;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  resize: none;
  font-family: 'omyu_pretty';
}

#button {
  position: relative;
  right: 250px;
}

button {
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 15px;
  margin-top: 10px;
  margin: 5px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  font-family: 'omyu_pretty';
  font-size: 17px;
}

button:hover {
  background-color: #dfdfdf;
  color: black;
}
</style>
