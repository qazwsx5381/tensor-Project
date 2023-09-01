import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// main.js 또는 Vue 인스턴스가 생성되는 파일에서 설정
import axios from 'axios'

// 모든 요청에 대해 CORS 허용
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

createApp(App).use(router).mount('#app')
