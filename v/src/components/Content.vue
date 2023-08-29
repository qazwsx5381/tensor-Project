<template>
  <section>
    <article>
      급상승
      <button @click="cm = cm === 'Nav' ? 'Adv' : 'Nav'">변경</button>
    </article>
    <!-- <component :is="cm"></component> -->
  </section>
  <!-- <Nav /> -->
  <!-- <Adv /> -->
</template>
<script>
// import Adv from './Adv.vue'
import Nav from './Nav.vue'
import Header from './Header.vue'
export default {
  name: 'Nav',
  data() {
    return {
      NavView: Nav
    }
  },
  components: {
    // Adv,
    Nav,
    Header
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
