<template>
  <div id="app">
    <router-link to="/" id="link">
      <img id="logo" src="./assets/북로고.png" alt="Logo" />
    </router-link>
    <div id="buttoncontainer">
      <button id="login" @click="openmodal()">Login</button>
      <button
        id="sign"
        @click=";[(modalOpen = true), (sign_modal = true), (log_modal = false)]"
      >
        Sign
      </button>
    </div>
    <nav>
      <router-link to="/Category">☰</router-link> |
      <router-link to="/NewBooks">신간</router-link> |
      <router-link to="/recommendedReading">추천 도서</router-link> |
      <router-link to="/BookLocation">위치찾기</router-link> |
      <router-link to="/bookCommunity">커뮤니티</router-link> |
      <router-link to="/bookInformation">책정보</router-link>
    </nav>
    <router-view />
    <!-- 모달창 -->
    <div id="modalcontainer" v-if="modalOpen" @click.self="closeModal">
      <div id="modalcontent" v-if="log_modal" @click.stop>
        <h3>Login</h3>
        <input type="text" id="id" placeholder="ID" />
        <input type="text" id="pw" placeholder="PW" />
        <button @click="submitmodal">확인</button>
        <button @click=";[(sign_modal = true), (log_modal = false)]">
          회원가입
        </button>
      </div>
      <div id="modalcontent" v-if="sign_modal">
        <h3>Sign-up</h3>
        <input type="text" id="id" placeholder="ID" />
        <input type="text" id="pw" placeholder="PW" />
        <button @click=";[(sign_modal = false), (log_modal = true)]">
          회원가입
        </button>
        <button @click=";[(sign_modal = false), (log_modal = true)]">
          로그인
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modalOpen: false,
      log_modal: true,
      sign_modal: false
    }
  },
  methods: {
    openmodal() {
      this.modalOpen = true
      this.log_modal = true
      this.sign_modal = false
    },
    submitmodal() {
      this.modalOpen = false
      this.log_modal = false
      this.sign_modal = false
    },
    closeModal() {
      this.modalOpen = false
    }
  }
}
</script>
<style scoped>
@font-face {
  font-family: 'omyu_pretty';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/omyu_pretty.woff2')
    format('woff2');
  font-weight: normal;
  font-style: normal;
}
#modalcontainer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

#modalcontent {
  background-color: white;
  width: 500px;
  height: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-content: space-evenly;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

input {
  width: 200px;
  height: 30px;
  border: none;
  border-bottom: 2px solid black;
  font-family: 'omyu_pretty';
}
#app {
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444;
  background-color: #ffffff;
  font-family: 'omyu_pretty';
  font-size: 20px;
}

nav {
  padding: 20px;
  font-size: 23px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

nav a {
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 12px;
  border-radius: 10px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

nav a:hover {
  background-color: #dfdfdf;
  color: #fff;
}

#logo {
  width: 350px;
  height: 100px;
  margin-top: 50px;
  border-radius: 8px;
}

#buttoncontainer {
  display: flex;
  justify-content: flex-end;
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

button:hover {
  background-color: #dfdfdf;
  color: black;
}
</style>
