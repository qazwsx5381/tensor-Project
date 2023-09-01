<template>
  <section>
    <article>
      <p v-if="rankBox.length > 0">{{ rankBox.join(', ') }}</p>
      <p v-else>Loading...</p>
    </article>
  </section>
</template>
<script>
import fetchData from './Rank.js'

export default {
  data() {
    return {
      rankBox: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.rankBox = await fetchData()
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
  padding: 25px;
  border: 2px solid green;
  background-color: antiquewhite;
}
section {
  text-align: center;
  width: 1200px;
  background-color: white;
  height: auto;
  display: flex;
}
</style>
