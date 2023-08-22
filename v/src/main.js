import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
const app = createApp(App)
app.config.globalProperties.$axios = axios
app.use(router).mount('#app')

// Mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 스키마
// const chatSchema = new mongoose.Schema(
//   {
//     chatId: { type: Number, required: true },
//     message: { type: String, required: true },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//       required: true,
//       get: formatTimestamp
//     }
//   },
//   {
//     toJSON: { getters: true, virtuals: false },
//     versionKey: false
//   }
// )

// 날짜 시간 표시
// function formatTimestamp(timestamp) {
//   return timestamp.toLocaleTimeString('ko-KR', {
//     year: 'numeric',
//     month: 'numeric',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit'
//   })
// }
