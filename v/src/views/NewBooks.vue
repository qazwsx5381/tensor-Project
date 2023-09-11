<template>
  <div class="centered-book-list">
    <div class="book-list">
      <h3>신간</h3>
      <ul class="item-list">
        <li v-for="(item, index) in items" :key="index" class="item">
          <div class="item-cover">
            <a :href="item.link" target="_blank">
              <img :src="item.cover" alt="Cover"
            /></a>
          </div>
          <div class="item-details">
            <div class="item-header">
              <span class="item-title">{{ item.title }}</span>
            </div>
            <div class="item-info">
              <span class="item-author"
                >{{ item.author }} | {{ item.publisher }} |
                {{ item.pubDate }}</span
              >
              <span class="item-price">
                <del>{{ numberFormat.format(item.priceStandard) }}원</del> ➔
                <span class="discounted-price"
                  >{{ numberFormat.format(item.priceSales) }}원</span
                >
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      items: [],
      numberFormat: new Intl.NumberFormat('ko-KR')
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      axios
        .post('/NewBooks')
        .then((response) => {
          const itemsArray = response.data.item
          this.items = Array.isArray(itemsArray) ? itemsArray : [itemsArray]
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }
}
</script>

<style scoped>
.centered-book-list {
  display: flex;
  justify-content: center;
}

.book-list {
  margin: 0 auto;
  width: 900px;
}

.item-list {
  list-style-type: none;
  padding: 0;
}

.item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 30px;
  transition: background-color 0.2s ease-in-out;
}

.item:hover {
  background-color: #f7f7f7;
}

.item-cover img {
  width: 200px;
  height: 274px;
  margin: 20px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}

.item-details {
  margin-left: 20px;
  flex-grow: 1;
}

.item-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.item-title {
  font-size: 23px;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.item-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 좌측 정렬 */
  margin-top: 10px; /* 조금 띄워줌 */
}

.item-author {
  font-size: 15px;
  color: #666;
  margin-bottom: 15px; /* 저자와 가격 사이 간격 조정 */
}

.item-price {
  font-size: 18px;
  color: #000000;
}
.discounted-price {
  color: red;
}
</style>
