<template>
  <div class="width">
    <Header />
    <Adv />
    <Footer />
  </div>
</template>
<script>
import Header from '../components/Header.vue'
import Adv from '../components/Adv.vue'
import Footer from '../components/Footer.vue'
export default {
  components: {
    Header,
    Adv,
    Footer
  }
}
</script>
<style scoped></style>
