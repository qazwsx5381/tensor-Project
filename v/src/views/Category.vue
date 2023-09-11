<template>
  <header>
    <div>
      <h3>카테고리</h3>
    </div>
    <div class="show">
      <div class="button">
        <span
          v-for="(category, index) in categories"
          :key="index"
          :class="{ click: selectedCategory === index }"
          @click="selectCategory(index)"
        >
          {{ category }}
        </span>
      </div>
      <div class="book">
        <div class="book_show" v-for="(v, i) in array.title" :key="i">
          <a :href="array.link[i]" target="_blank"
            ><img :src="array.img[i]" alt=""
          /></a>
          <span class="title">{{ v }}</span>
          <span class="author">{{ array.author[i] }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      categories: [
        '경제경영',
        '고전',
        '과학',
        '만화',
        '사회과학',
        '소설/시/희곡',
        '에세이',
        '여행',
        '역사',
        '외국어',
        '인문학',
        '자기계발',
        '종교',
        '청소년',
        '컴퓨터/모바일'
      ],
      categoryID: [
        170, 2105, 987, 2551, 798, 1, 55889, 1196, 74, 1322, 656, 336, 1237,
        1137, 351
      ],
      selectedCategory: 0,
      array: ''
    }
  },
  mounted() {
    this.selectCategory(this.selectedCategory)
  },
  methods: {
    selectCategory(index) {
      this.selectedCategory = index
      this.axiosSend(index)
    },
    axiosSend(event) {
      axios.post('/getBook', { ID: this.categoryID[event] }).then((res) => {
        this.array = res.data
      })
    }
  }
}
</script>
<style scoped>
header {
  width: 1200px;
  margin: auto;
}
div.show {
  display: flex;
}
div.button {
  display: flex;
  flex-direction: column;
  width: 200px;
}
div.button span {
  padding: 10px 0;
  font-size: 1.5rem;
  transition: 0.5s;
}
div.button span:hover {
  background-color: rgb(175, 175, 175);
  cursor: pointer;
  color: white;
  transition: 0.5s;
}
div.button span.click {
  background-color: rgb(0, 0, 0);
  color: white;
  transition: 0.5s;
}
div.book {
  width: 1000px;
  display: flex;
  flex-flow: row wrap;
}
div.book_show {
  width: 180px;
  margin: 0 10px;
  height: 400px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
div.book_show a {
  display: block;
}
div.book_show a img {
  width: 150px;
  border: 1px solid black;
}
div.book_show span.title {
  font-size: 1.2rem;
}
div.book_show span.author {
  font-size: 1rem;
}
</style>
