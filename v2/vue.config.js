const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/Header': {
        target: 'http://localhost:3001', // 프록시 서버 주소
        changeOrigin: true
      }
    }
  }
}
