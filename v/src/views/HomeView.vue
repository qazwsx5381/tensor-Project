<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <button @click="turnon_off()">test</button>
    <div
      v-if="test"
      style="width: 300px; height: 300px; background-color: red"
    ></div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      test: false
    }
  },
  methods: {
    turnon_off() {
      setInterval(() => {
        this.test = true
      }, 1000)
    }
  }
}
</script>
