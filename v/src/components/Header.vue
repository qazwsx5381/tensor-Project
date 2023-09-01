<template>
  <div class="width">
    <Content />
    <Nav />
  </div>
</template>
<script>
import Nav from '../components/Nav.vue'
import Content from '../components/Content.vue'
export default {
  components: {
    Nav,
    Content
  }
}
</script>
<style scoped>
div {
  display: flex;
  justify-content: center;
}
</style>
