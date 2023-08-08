<template>
  <div id="container">
    <div id="nav"></div>
    <div id="best"></div>
    <div id="age"></div>
    <div id="hot"></div>
  </div>
  <div id="foot"></div>
</template>
<script></script>
<style>
#container {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: black;
  width: 100%;
  height: 100%;
  padding: 20px;
}

#nav {
  background-color: aqua;
  width: 150px;
  height: 250px;
  align-self: flex-start;
}

#best {
  background-color: red;
  flex-grow: 2;
  width: 50px;
  height: 50px;
}

#age {
  background-color: blue;
  flex-grow: 2;
  width: 50px;
  height: 50px;
}

#hot {
  background-color: green;
  order: 5;
  width: 50px;
  height: 50px;
}

#foot {
  background-color: gold;
  width: 100%;
  height: 50px;
}
</style>
