<template>
  <section>
    <h3>이달의 새로운 책</h3>
    <div id="container" v-for="n in 5 " :key='n'>
      <div id="img">사진</div>
      <p id="text">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi, rerum
        incidunt perspiciatis deleniti qui assumenda obcaecati nihil a quis quae
        consequatur porro labore inventore eos cupiditate consequuntur officiis
        vero? Libero?
      </p>
    </div>
  </section>
</template>
<script setup>
</script>
<style scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

#img {
  width: 200px;
  height: 200px;
  border: 1px solid black;
  margin: 10px;
}
</style>
