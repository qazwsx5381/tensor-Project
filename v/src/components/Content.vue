<template>
  <section>
    <article>
      <h3>실시간 검색순위</h3>
      <div class="line" v-for="(v, i) in rankBox" :key="i">
        <span class="rank">{{ i + 1 }}</span>
        <span class="text">{{ v }}</span>
      </div>
    </article>
  </section>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      rankBox: ''
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        axios.post('/realTime').then((res) => {
          this.rankBox = res.data
        })
      } catch (error) {
        console.error('An error occurred while loading data:', error)
        this.rankBox = ['Error']
      }
    }
  }
}
</script>
<style scoped>
article {
  width: 300px;
}
h3 {
  margin: 0;
  margin-bottom: 20px;
}
div.line {
  display: flex;
  justify-content: start;
  align-items: center;
}
div.line:hover {
  transform: scale(1.15);
  transition: transform 0.5s;
}
span.rank {
  display: flex;
  background-color: #000000;
  border: 1px solid #000000;
  border-radius: 3px;
  margin-bottom: 5px;
  color: white;
  width: 25px;
  height: 25px;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}
span.text {
  word-break: keep-all;
  word-wrap: break-word;
}
</style>
