const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
// vue.config.js
module.exports = {
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://ds1234.iptime.org:7901/', // 실제 백엔드 서버 주소
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // /api 경로를 빈 문자열로 바꾸어 중계
        }
      }
    }
  }
}
