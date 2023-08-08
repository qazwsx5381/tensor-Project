<template>
  <img id="logo" src="./assets/북로고.png" alt="">
  <nav>
    <router-link to="/Home">Home</router-link> /
    <router-link to="/BestSeller">Best 도서</router-link> /
    <router-link to="/recommendedReading">추천 도서</router-link> /
    <router-link to="/NewBooks">신간</router-link> /
    <router-link to="/bookCategory">카테고리</router-link> /
    <router-link to="/bookInformation">책정보</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  font-size: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
#logo {
  width: 450px;
  height: 150px;
}
</style>
