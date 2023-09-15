<template>
  <section class="best-sellers">
    <div class="best_title">
      <img
        class="arrow"
        src="../assets/chevron_left_FILL0_wght400_GRAD0_opsz24.svg"
        alt=""
      />
      <h3 class="section-title">베스트셀러</h3>
      <img
        class="arrow"
        src="../assets/chevron_right_FILL0_wght400_GRAD0_opsz24.svg"
        alt=""
      />
    </div>
    <div class="book-list">
      <div v-for="(item, itemIndex) in items" :key="itemIndex" class="item">
        <div class="item-cover">
          <a :href="item.link" target="_blank"
            ><img :src="item.cover" alt="Cover"
          /></a>
        </div>
        <div class="item-details">
          <div class="item-header">
            <h4 class="item-title">{{ item.title }}</h4>
          </div>
          <div class="item-info">
            <p class="item-author">{{ item.author }}</p>
            <p class="item-meta">{{ item.publisher }} | {{ item.pubDate }}</p>
            <p class="item-price">
              <del>{{ formattedPrice(item.priceStandard) }}원</del> →
              <span class="discounted-price">
                {{ formattedPrice(item.priceSales) }}원
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      items: [],
      numberFormat: new Intl.NumberFormat('ko-KR'),
      test: false
    }
  },
  mounted() {
    this.fetchData()
    this.scrollTable()
    this.scrollCreate()
    this.drag()
  },
  methods: {
    fetchData() {
      axios
        .post('/homeBestseller')
        .then((response) => {
          const itemsArray = response.data.item
          this.items = Array.isArray(itemsArray) ? itemsArray : [itemsArray]
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
    formattedPrice(price) {
      return this.numberFormat.format(price)
    },
    scrollTable() {
      const wrapper = document.querySelector('.book-list')
      const left = document.querySelectorAll('.arrow')[0]
      const right = document.querySelectorAll('.arrow')[1]
      wrapper.style.scrollBehavior = 'smooth'
      setInterval(() => {
        if (!this.test) {
          wrapper.scrollLeft = wrapper.scrollLeft + 244

          if (
            wrapper.offsetWidth + wrapper.scrollLeft + 244 >=
            wrapper.scrollWidth
          ) {
            const items = wrapper.querySelectorAll('.item')
            items.forEach((item) => {
              const newItem = item.cloneNode(true)
              wrapper.appendChild(newItem)
            })
            wrapper.scrollLeft = wrapper.scrollLeft + 244
          }
        }
      }, 2000)
      wrapper.addEventListener('mouseover', () => {
        this.test = true
        wrapper.style.scrollBehavior = 'auto'
      })
      wrapper.addEventListener('mouseleave', () => {
        this.test = false
        wrapper.style.scrollBehavior = 'smooth'
      })
      left.addEventListener('mouseover', () => {
        this.test = true
      })
      left.addEventListener('mouseleave', () => {
        this.test = false
        wrapper.style.scrollBehavior = 'smooth'
      })
      right.addEventListener('mouseover', () => {
        this.test = true
      })
      right.addEventListener('mouseleave', () => {
        this.test = false
        wrapper.style.scrollBehavior = 'smooth'
      })
    },
    scrollLeft() {
      const left = document.querySelectorAll('.arrow')[0]
      const wrapper = document.querySelector('.book-list')
      left.addEventListener('click', () => {
        wrapper.scrollLeft = wrapper.scrollLeft - 244
        if (wrapper.offsetWidth + wrapper.scrollLeft >= wrapper.scrollWidth) {
          wrapper.scrollLeft = 0
        }
      })
    },
    scrollRight() {
      const right = document.querySelectorAll('.arrow')[1]
      const wrapper = document.querySelector('.book-list')
      right.addEventListener('click', () => {
        wrapper.scrollLeft = wrapper.scrollLeft + 244
        if (
          wrapper.offsetWidth + wrapper.scrollLeft + 224 >=
          wrapper.scrollWidth
        ) {
          const items = wrapper.querySelectorAll('.item')
          items.forEach((item) => {
            const newItem = item.cloneNode(true)
            wrapper.appendChild(newItem)
          })
          wrapper.scrollLeft = wrapper.scrollLeft + 244
        }
      })
    },
    scrollCreate() {
      const right = document.querySelectorAll('.arrow')[1]
      right.addEventListener('click', this.scrollRight())
      const left = document.querySelectorAll('.arrow')[0]
      left.addEventListener('click', this.scrollLeft())
    },
    drag() {
      const slider = document.querySelector('.book-list')

      let isDown = false
      let startX
      let scrollLeft

      slider.addEventListener('mousedown', (e) => {
        isDown = true
        slider.classList.add('active')
        startX = e.pageX - slider.offsetLeft
        scrollLeft = slider.scrollLeft
      })
      slider.addEventListener('mouseleave', () => {
        isDown = false
        slider.classList.remove('active')
      })
      slider.addEventListener('mouseup', () => {
        isDown = false
        slider.classList.remove('active')
      })
      slider.addEventListener('mousemove', (e) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - slider.offsetLeft
        const walk = x - startX // scroll-fast
        slider.scrollLeft = scrollLeft - walk
        console.log(slider.scrollLeft - walk)
        console.log(slider.scrollWidth)
        if (slider.scrollLeft - walk + 1000 >= slider.scrollWidth) {
          const items = slider.querySelectorAll('.item')
          items.forEach((item) => {
            const newItem = item.cloneNode(true)
            slider.appendChild(newItem)
          })
          slider.scrollLeft = scrollLeft - walk
        }
      })
    }
  }
}
</script>

<style scoped>
section.best-sellers {
  text-align: center;
  width: 900px;
  overflow-x: scroll;
  overflow-y: hidden;
  display: inline;
}

/* Updated styles for section title */
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

div.best_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
}

img.arrow {
  height: 36px;
  border: 1.5px solid black;
  cursor: pointer;
}
/* Add margin between section title and list */
.book-list {
  width: 100%;
  margin-top: 20px;
  position: relative;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  justify-content: start;
  transition: all;
  will-change: transform;
  user-select: none;
}
.book-list::-webkit-scrollbar {
  display: none;
}
.book-list::-webkit-scrollbar-thumb {
  background-color: #b1b1b1;
  border-radius: 10px;
  background-clip: padding-box;
  border: 3px solid transparent;
  border-radius: 8px;
}
.book-list::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 10px;
}
.active {
  cursor: grabbing;
  cursor: -webkit-grabbing;
}
.item-list-horizontal {
  flex-wrap: wrap; /* Added to wrap items to the next line */
  list-style: none;
  margin: 0;
}

.item-group {
  display: flex;
  justify-content: space-between;
  width: calc(20% - 20px); /* Adjust the width for 5 items per row */
  margin-bottom: 20px; /* Add some space between rows */
}
a {
  display: flex;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
  padding: 1px;
  background-color: rgb(250, 249, 249);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-cover {
  margin-bottom: 10px;
  border: 1px solid #000;
}

.item-cover a img {
  margin: none;
}

.item-details {
  text-align: center;
}

.item-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.item-author {
  font-size: 1rem;
  color: #555;
  margin: 5px 0;
}

.item-meta {
  font-size: 1rem;
  color: #777;
  margin: 0;
}

.discounted-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: green;
  margin-top: 5px;
}
</style>
