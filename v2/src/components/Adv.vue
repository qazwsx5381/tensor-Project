<template>
  <h3 style="margin-top: 100px">이달의 주목 도서</h3>
  <div class="book-container">
    <div v-for="book in Data" :key="book.tit" class="book-item">
      <div class="book-image">
        <img :src="book.cover" :alt="book.tit" />
      </div>
      <h3 class="book-title">{{ book.title }}</h3>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MonthBook',
  data() {
    return {
      Data: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:3001/')
        this.Data = response.data
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.book-container {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px;
}

.book-item {
  padding: 25px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  flex: 0 0 auto;
  width: 300px;
}

.book-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
}

.book-image img {
  width: 150px;
  height: 200px;
  border-radius: 5px;
}

.book-title {
  margin-top: 10px;
  font-size: 1.2rem;
  color: #333;
}
</style>
