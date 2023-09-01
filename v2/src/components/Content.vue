<template>
  <div>
    <h1>링크</h1>
    <ul>
      <li v-for="(book, index) in bookRankings" :key="index">
        {{ index + 1 }}위: {{ book }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      bookRankings: []
    }
  },
  created() {
    this.fetchBookRankings()
  },
  methods: {
    async fetchBookRankings() {
      try {
        const response = await axios.get('http://localhost:3001/')
        this.bookRankings = response.data
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }
}
</script>

<style scoped>
article {
  padding: 25px;
  border: 2px solid green;
  background-color: antiquewhite;
}
section {
  text-align: center;
  /* border: 2px solid red; */
  background-color: white;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr;
}
</style>
