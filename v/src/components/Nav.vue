<template>
  <section>
    <article>
      베스트셀러
      <!-- <button @click="cm = cm === 'Adv' ? 'Nav' : 'Adv'">변경</button> -->
    </article>
  </section>
  <component :is="cm"></component>
</template>
<script>
// import Adv from './Adv.vue'
// import Nav from './Nav.vue'
// export default {
//   data() {
//     return {
//       cm: 'Adv'
//     }
//   },
//   components: {
//     Nav,
//     Adv
//   }
// }
</script>
<style scoped>
section {
  text-align: center;
  padding: 25px;
  border: 1px solid gray;
  background-color: rgb(233, 182, 248);
}
</style>
