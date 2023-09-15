<template>
  <section>
    <h3>추천 도서</h3>
    <div id="container" v-for="n in commandArray" :key="n">
      <div id="img">
        <a :href="n.link" target="_blank"
          ><img
            :src="n.cover"
            :alt="n.title"
            style="width: 200px; height: 274px"
        /></a>
      </div>
      <div class="book_info">
        <div class="text">
          <div class="line">
            <span class="fixed">제목</span
            ><span class="relative">{{ n.title }}</span>
          </div>
          <div class="line">
            <span class="fixed">저자</span
            ><span class="relative">{{ n.author }}</span>
          </div>
          <div class="line">
            <span class="fixed">출간일</span
            ><span class="relative">{{ n.pubDate }}</span>
          </div>
          <div class="line">
            <span class="fixed">가격</span
            ><span class="relative"
              ><del>{{ numberFormat.format(n.priceStandard) }}</del> →
              {{ numberFormat.format(n.priceSales) }}</span
            >
          </div>
          <div class="line" v-if="n.description">
            <span class="fixed">설명</span
            ><span class="last">{{ n.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
export default {
  name: 'bestseller',
  data() {
    return {
      commandArray: '',
      numberFormat: new Intl.NumberFormat('ko-KR')
    }
  },
  mounted() {
    this.load_bestseller()
  },
  methods: {
    load_bestseller() {
      axios.post('/bestseller').then((res) => {
        this.commandArray = res.data
      })
    }
  }
}
</script>
<style scoped>
#container {
  display: flex;
  justify-content: center;
}

#img {
  width: 200px;
  height: 274px;
  border: 1px solid rgb(104, 101, 101);
  background-color: rgb(50, 37, 235);
  margin: 10px;
}
#img:hover {
  transform: scale(1.15);
  transition: transform 0.5s;
}

div.book_info {
  display: flex;
  justify-items: start;
  align-items: center;
  width: 700px;
}

div.line {
  display: flex;
  justify-items: start;
  align-items: center;
}
span.fixed {
  width: 100px;
}
span.relative {
  display: inline-block;
  text-align: start;
  width: 680px;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 0px;
}
span.last {
  display: inline-block;
  text-align: start;
  width: 680px;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
