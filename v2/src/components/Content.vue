<template>
  <section>
    <article>급상승</article>
    <component :is="cm"></component>
  </section>
  <!-- <Nav /> -->
  <!-- <Adv /> -->
</template>
<script>
import Nav from './Nav.vue'
export default {
  data() {
    return {
      cm: 'Nav'
    }
  },
  components: {
    Nav
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
