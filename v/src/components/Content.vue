<template>
  <section>
    <article>급상승
      <!-- <button @click="cm = (cm === 'Nav' ? 'Adv' : 'Nav')">변경</button> -->
    </article>
    <component :is="cm"></component>
  </section>
  <!-- <Nav /> -->
  <!-- <Adv /> -->
</template>
<script>
import Nav from './Nav.vue'
import Header from './Header.vue'
export default {
  data() {
    return {
      cm: 'Nav'
    }
  },
  components: {
    Nav,
    Header
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
  height: 500px;
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</style>
