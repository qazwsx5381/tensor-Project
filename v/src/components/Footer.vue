<template>
  <div>
    <h1>Random Quote</h1>
    <div id="quote">
      <p>{{ currentQuote.name }}</p>
      <p>- {{ currentQuote.text }}</p>
    </div>
    <button @click="randomQuote">다른 명언 보기</button>
  </div>
</template>

<script>
import quotes from '@/Quotes.js'

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
  }
}
</script>
