<template>
  <div id="app">
    <router-link to="/" id="link">
    <img id="logo" src="./assets/북로고.png" alt="Logo" />
  </router-link>
    <nav>
      <router-link to="/BestSeller">Best 도서</router-link> /
      <router-link to="/recommendedReading">추천 도서</router-link> /
      <router-link to="/NewBooks">신간</router-link> /
      <router-link to="/bookCategory">카테고리</router-link> /
      <router-link to="/bookInformation">책정보</router-link> /
    </nav>
    <router-view />
  </div>
</template>
<script>
</script>
<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444;
  background-color: #ffffff;
  padding: 20px;
}

nav {
  padding: 20px;
  font-size: 18px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 30px;
}

nav a {
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

nav a:hover {
  background-color: #dfdfdf;
  color: #fff;
}

#logo {
  width: 250px;
  height: 100px;
  margin-bottom: 30px;
  border-radius: 8px;
}
</style>
