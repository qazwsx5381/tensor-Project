<template>
  <section>
    <article>
      베스트셀러
      <button @click="cm = cm === 'Nav' ? 'Adv' : 'Nav'">변경</button>
    </article>
  </section>
  <component :is="cm"></component>
</template>
<script>
import Adv from './Adv.vue'
export default {
  data() {
    return {
      cm: 'Adv'
    }
  },
  components: {
    Adv
  }
}
</script>
<style scoped>
section {
  text-align: center;
  padding: 25px;
  border: 1px solid gray;
  background-color: rgb(233, 182, 248);
}
</style>
