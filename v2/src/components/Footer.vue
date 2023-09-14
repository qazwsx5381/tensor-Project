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
  width: 100%;
  height: 200px;
  /* background-color: rgb(119, 119, 119); */
  /* 배경 이미지 설정 */
  background-image: url('https://img.freepik.com/free-photo/design-space-paper-textured-background_53876-139913.jpg?w=1380&t=st=1694674439~exp=1694675039~hmac=f5e45093a831d978b6d48d4edd08b7fc0c671e538b8e78622d8e66541915c44b');
  margin: 10px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

p {
  color: rgb(109, 109, 109);
}
p.text {
  display: inline-block;
  width: 80%;
  word-break: keep-all;
  word-wrap: break-word;
}
</style>
