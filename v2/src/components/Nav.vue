<template>
  <section class="best-sellers">
    <h3 class="section-title">베스트셀러</h3>
    <br />
    <div class="book-list">
      <ul class="item-list-horizontal">
        <li
          v-for="(itemGroup, groupIndex) in groupedItems"
          :key="groupIndex"
          class="item-group"
        >
          <div
            v-for="(item, itemIndex) in itemGroup"
            :key="itemIndex"
            class="item"
          >
            <div class="item-cover">
              <img :src="item.cover" alt="Cover" />
            </div>
            <div class="item-details">
              <div class="item-header">
                <h4 class="item-title">{{ item.title }}</h4>
              </div>
              <div class="item-info">
                <p class="item-author">{{ item.author }}</p>
                <p class="item-meta">
                  {{ item.publisher }} | {{ item.pubDate }}
                </p>
                <p class="item-price">
                  <del>{{ formattedPrice(item.priceStandard) }}원</del> →
                  <span class="discounted-price">
                    {{ formattedPrice(item.priceSales) }}원
                  </span>
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
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
        .get('http://localhost:3001/Bestseller')
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
    }
  },
  computed: {
    groupedItems() {
      const groupSize = 5
      const grouped = []
      for (let i = 0; i < this.items.length; i += groupSize) {
        grouped.push(this.items.slice(i, i + groupSize))
      }
      return grouped
    }
  }
}
</script>

<style scoped>
.best-sellers {
  text-align: center;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.book-list {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.item-list-horizontal {
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
}

.item-group {
  display: flex;
  justify-content: space-between;
  width: calc(20% - 20px);
  margin-bottom: 20px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
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
