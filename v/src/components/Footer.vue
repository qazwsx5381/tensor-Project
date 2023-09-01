<template>
  <div>
    <div id="quotes">
      <div id="container" @click="randomQuote">
        <p>{{ currentQuote.name }}</p>
        <p class="text">{{ currentQuote.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import quotes from './quotes.js'
export default {
  name: 'RandomQuoteComponent',
  data() {
    return {
      quotes: quotes,
      currentQuote: {}
    }
  },
  methods: {
    getRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.quotes.length)
      return this.quotes[randomIndex]
    },
    randomQuote() {
      // 새로운 랜덤 명언 표시
      this.currentQuote = this.getRandomQuote()
    }
  },
  mounted() {
    // 초기에 랜덤 명언을 표시
    this.randomQuote()
    // 시간이 지나면 자동으로 넘김
    setInterval(this.randomQuote, 5000)
  }
}
</script>
<style scoped>
#quotes {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#container {
  width: 1200px;
  height: 300px;
  background-color: rgb(119, 119, 119);
  margin: 10px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

p {
  color: white;
}
p.text {
  display: inline-block;
  width: 60%;
  word-break: keep-all;
  word-wrap: break-word;
}
</style>
