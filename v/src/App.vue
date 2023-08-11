<template>
  <!-- 로그인 및 회원가입 버튼 -->
  <div v-if="login_info">
    <button
      @click=";[(login = true), ((signup = false), (login_info = false))]"
    >
      로그인
    </button>
    <button @click=";[(signup = true), (login = false), (login_info = false)]">
      회원가입
    </button>
  </div>
  <!-- 로그인 성공시 -->
  <div v-if="login_suc">
    <div id="login_text">{{ login_name }}</div>
    <button @click="logout()">로그아웃</button>
  </div>
  <!-- 로그인 -->
  <div v-if="login">
    <div id="login_id">
      <span>아이디</span><input type="text" v-model="login_id" />
    </div>
    <div id="login_pw">
      <span>비밀번호</span><input type="password" v-model="login_pw" />
    </div>
    <div id="login_btn">
      <button @click="loginInfo()">로그인</button
      ><button @click=";[(login = false), (signup = true)]">회원가입</button>
      <button
        @click=";[(login = false), (signup = false), (login_info = true)]"
      >
        닫기
      </button>
    </div>
  </div>
  <!-- 회원가입 -->
  <div v-if="signup">
    <div>
      아이디<input type="text" v-model="input_id" @keyup="check_id()" />
    </div>
    <div id="checkFailedId" v-if="check_failed">
      <small>{{ checkid }}</small>
    </div>
    <div id="checkSucceseId" v-if="check_succese">
      <small>{{ checkId }}</small>
    </div>
    <div>
      비밀번호<input
        :type="view === true ? 'password' : 'text'"
        v-model="input_pw"
      /><button @click="view_pw">
        <img
          src="./eye_off.svg"
          alt=""
          v-if="!view"
          title="비밀번호 숨기기"
        /><img src="./eye_on.svg" alt="" title="비밀번호 보기" v-if="view" />
      </button>
    </div>
    <div>이름<input type="text" v-model="input_name" /></div>
    <div>e-mail<input type="text" v-model="input_mail" /></div>
    <button
      v-if="
        input_id != '' &&
        check_succese === true &&
        input_pw != '' &&
        input_name != '' &&
        input_mail != ''
      "
      @click=";[submit(), (signup = false), (login = true)]"
    >
      제출
    </button>
    <button @click=";[(signup = false), (login = true)]">뒤로가기</button>
    <button @click=";[(login = false), (signup = false), (login_info = true)]">
      닫기
    </button>
  </div>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">login</router-link>
  </nav>
  <div style="display: none">
    <loginView :message="String(loginSucceseID)" />
  </div>
  <router-view />
</template>
<script>
import axios from 'axios'
import loginView from './views/loginView.vue'
export default {
  components: {
    loginView
  },
  data() {
    return {
      login: false,
      signup: false,
      check_failed: false,
      check_succese: false,
      view: true,
      login_suc: false,
      login_info: true,
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
  methods: {
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
      axios
        .post('/', {
          id: this.login_id,
          pw: this.login_pw
        })
        .then((res) => {
          if (res.data === 'error') {
            alert('id 혹은 비밀번호가 잘못 되었습니다. 다시 로그인해주세요.')
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
        }
      })
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
