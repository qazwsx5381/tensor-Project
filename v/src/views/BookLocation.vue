<template>
  <section>
    <h3>가장 가까운 서점</h3>
    <div id="container">
      <div id="map">지도위치</div>
      <p id="text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quasi
        libero, asperiores doloribus vel soluta, a eligendi animi pariatur ea
        beatae! Autem exercitationem aut laborum illum eum quia totam!
        Veritatis.
      </p>
    </div>
  </section>
</template>
<script></script>
<style scoped>
#container {
  width: 100%;
  height: auto;
  /* background-color: black; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#map {
  width: 900px;
  height: 500px;
  border: 1px solid black;
}

#text {
  width: 900px;
  height: 150px;
  border: 1px solid black;
}
</style>
