<template>
  <div class="width">
    <Content />
    <Header />
    <Footer />
  </div>
</template>
<script>
import Content from '../components/Content.vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
export default {
  components: {
    Content,
    Header,
    Footer
  }
}
</script>
<style scoped>
div.width {
  width: auto;
  margin: auto;
}
</style>
