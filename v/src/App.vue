<template>
  <div id="app">
    <!-- 중앙로고 -->
    <router-link to="/" id="link">
      <img id="logo" src="./assets/북로고.png" alt="Logo" />
    </router-link>
    <!-- 로그인 및 회원가입 버튼 -->
    <div id="buttoncontainer" v-if="login_info">
      <button
        id="login"
        @click="
          ;[
            (login = true),
            ((signup = false), (login_info = false)),
            openmodal()
          ]
        "
      >
        로그인
      </button>
      <button
        id="sign"
        @click="
          ;[
            (signup = true),
            (login = false),
            (login_info = false),
            (modalOpen = true)
          ]
        "
      >
        회원가입
      </button>
    </div>
    <!-- 로그인 성공시 -->
    <div id="succese_login" v-if="login_suc">
      <div id="login_text">{{ login_name }}</div>
      <button @click="logout()">로그아웃</button>
    </div>
    <!-- 로그인 -->
    <div id="modalcontainer" v-if="modalOpen" @click.self="closeModal">
      <div id="modalcontent" v-if="login">
        <div id="login_id">
          <input type="text" v-model="login_id" placeholder="ID" />
        </div>
        <div id="login_pw">
          <input
            type="password"
            v-model="login_pw"
            placeholder="PW"
            @keyup.enter="loginInfo()"
          />
        </div>
        <div id="login_btn">
          <button @click="loginInfo()">로그인</button
          ><button @click=";[(login = false), (signup = true)]">
            회원가입
          </button>
          <button
            class="image"
            @click="
              ;[
                (login = false),
                (signup = false),
                (login_info = true),
                (modalOpen = false)
              ]
            "
          >
            <img
              id="log_close_btn"
              src="./assets/close.svg"
              alt="닫기"
              title="닫기"
            />
          </button>
        </div>
      </div>
      <!-- 회원가입 -->
      <div id="signcontent" v-if="signup">
        <div>
          <input
            type="text"
            v-model="input_id"
            @keyup="check_id()"
            placeholder="ID"
          />
        </div>
        <div id="checkFailedId" v-if="check_failed">
          <small>{{ checkid }}</small>
        </div>
        <div id="checkSucceseId" v-if="check_succese">
          <small>{{ checkId }}</small>
        </div>
        <div id="signpw">
          <input
            :type="view === true ? 'password' : 'text'"
            v-model="input_pw"
            placeholder="PW"
          />
        </div>
        <div class="imgbtn">
          <button class="image" @click="view_pw">
            <img
              class="eye"
              src="./views/eye_off.svg"
              alt=""
              v-if="!view"
              title="비밀번호 숨기기"
            /><img
              class="eye"
              src="./views/eye_on.svg"
              alt=""
              title="비밀번호 보기"
              v-if="view"
            />
          </button>
        </div>
        <div>
          <input type="text" v-model="input_name" placeholder="이름" />
        </div>
        <div>
          <input type="text" v-model="input_mail" placeholder="E-mail" />
        </div>
        <div id="sign_btn">
          <button
            :disabled="
              input_mail != '' &&
              input_name != '' &&
              input_pw != '' &&
              input_id != '' &&
              check_succese === true
                ? false
                : true
            "
            @click="
              ;[submit(), (signup = false), (login = true), (modalOpen = false)]
            "
          >
            회원가입
          </button>
          <button @click=";[(signup = false), (login = true)]">뒤로가기</button>
        </div>
        <button
          class="image"
          @click="
            ;[
              (login = false),
              (signup = false),
              (login_info = true),
              (modalOpen = false)
            ]
          "
        >
          <img
            id="close_btn"
            src="./assets/close.svg"
            alt="닫기"
            title="닫기"
          />
        </button>
      </div>
    </div>
    <nav>
      <router-link to="/Category">☰</router-link> |
      <router-link to="/NewBooks">신간</router-link> |
      <router-link to="/recommendedReading">추천 도서</router-link> |
      <router-link to="/BookLocation">위치찾기</router-link> |
      <router-link to="/bookCommunity" @click="handleLinkClick()"
        >커뮤니티</router-link
      >
      |
      <router-link to="/bookInformation">책정보</router-link>
    </nav>
    <router-view />
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      login: false,
      signup: false,
      check_failed: false,
      check_succese: false,
      view: true,
      login_suc: false,
      login_info: true,
      modalOpen: false,
      input_id: '',
      input_pw: '',
      input_name: '',
      input_mail: '',
      login_id: '',
      login_pw: '',
      login_name: '',
      checkid: '',
      checkId: '',
      loginSucceseID: ''
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    }
  },
  mounted() {
    this.cookie_check()
  },
  methods: {
    openmodal() {
      this.modalOpen = true
    },
    // 아이디 중복체크
    check_id() {
      if (this.input_id === '') {
        this.check_failed = false
        this.check_succese = false
      } else {
        axios
          .post('/', {
            id: this.input_id
          })
          .then((res) => {
            if (res.data === 'NO') {
              this.check_succese = false
              this.check_failed = true
              this.checkid = '중복된 아이디입니다. 다시 입력해주세요.'
            } else {
              this.check_succese = true
              this.check_failed = false
              this.checkId = '사용가능한 아이디입니다.'
            }
          })
      }
    },
    // 회원가입
    submit() {
      axios
        .post('/', {
          id: this.input_id,
          pw: this.input_pw,
          name: this.input_name,
          mail: this.input_mail
        })
        .then((res) => {
          if (res.data === 'succese') {
            alert('회원가입되었습니다. 환영합니다.')
            this.modalOpen = false
            this.login_info = true
            this.input_id = ''
            this.input_pw = ''
            this.input_name = ''
            this.input_mail = ''
          }
        })
    },
    // 비밀번호 보이게
    view_pw() {
      this.view = !this.view
    },
    // 로그인하기
    loginInfo() {
      if (this.login_id === '' || this.login_pw === '') {
        return alert('ID 혹은 비밀번호를 입력해주세요.')
      }
      axios
        .post('/', {
          id: this.login_id,
          pw: this.login_pw
        })
        .then((res) => {
          if (res.data === 'error') {
            alert('ID 혹은 비밀번호가 잘못 되었습니다. 다시 로그인해주세요.')
          } else {
            const rec = res.data
            alert(`${rec.name}(${rec.id})님 반갑습니다.`)
            this.login_suc = true
            this.login_info = false
            this.login = false
            this.login_id = ''
            this.login_pw = ''
            this.loginSucceseID = rec.id
            this.login_name = `${rec.name}(${rec.id})님 반갑습니다.`
            this.modalOpen = false
          }
        })
    },
    // 로그아웃
    logout() {
      axios.post('/', { loginID: this.loginSucceseID }).then((res) => {
        if (res.data === 'logout') {
          alert('로그아웃되었습니다.')
          this.login_info = true
          this.login_suc = false
          this.loginSucceseID = ''
          this.$router.go(0)
        }
      })
    },
    // cookie 체크
    cookie_check() {
      if (document.cookie) {
        const cookie = document.cookie.split('=')
        this.login_suc = true
        this.login_info = false
        this.login = false
        this.loginSucceseID = cookie[0]
        console.log(this.loginSucceseID)
        this.login_name = `${decodeURIComponent(cookie[1])}(${
          cookie[0]
        })님 반갑습니다.`
      }
    },
    handleLinkClick() {
      this.$router.replace({ path: '/bookCommunity' })
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

#signcontent {
  background-color: white;
  width: 500px;
  height: 500px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

#signcontent input {
  width: 200px;
  height: 30px;
  border: none;
  border-bottom: 2px solid black;
  font-family: 'omyu_pretty';
  margin-bottom: 30px;
}
#signcontent input:last-child {
  margin-bottom: 40px;
}

#signcontent div#sign_btn {
  display: flex;
  align-items: center;
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

input:focus {
  width: 200px;
  height: 30px;
  outline-style: none;
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
  margin-bottom: 10px;
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

button:hover:disabled {
  background-color: #979797;
}

button:disabled {
  background-color: #979797;
  color: black;
}

div#signpw {
  display: flex;
}

div#succese_login {
  display: flex;
  align-items: end;
  width: 98%;
  flex-direction: column;
  margin-bottom: 10px;
}

div#succese_login div {
  margin-bottom: 15px;
}

div.imgbtn {
  display: flex;
  width: 0;
  height: 0;
  margin: 0;
}
img.eye {
  width: 1rem;
  height: 1rem;
  margin: auto;
  opacity: 0.5;
}
button.image {
  width: 0;
  height: 0;
  position: relative;
  border: none;
  background-color: white;
  margin: 0px;
}
button.image:hover {
  border: none;
  background-color: white;
}
img.eye {
  position: relative;
  left: 5rem;
  bottom: 67.6px;
}

img#close_btn {
  position: absolute;
  left: 12rem;
  bottom: 22rem;
}

img#log_close_btn {
  position: absolute;
  left: 5.5rem;
  bottom: 324.5px;
}

button:hover {
  background-color: #dfdfdf;
  color: black;
}
</style>
