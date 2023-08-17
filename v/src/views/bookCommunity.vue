<template>
  <section>
    <div id="container">
      <table id="table">
        <thead>
          <tr>
            <th>NO.</th>
            <th>닉네임</th>
            <th>내용</th>
            <th>조회수</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(memo, index) in memos" :key="index">
          <td>{{ memo.nickname }}</td>
          <td>{{ memo.date }}</td>
          <td>{{ memo.title }}</td>
          <td>{{ memo.content }}</td>
        </tr>
      </tbody>
      </table>
    </div>
    <router-link to="Memo" id="link">
    <button id="button">글쓰기</button>
    </router-link>
  </section>
</template>
<script>
import Memo from './Memo.vue'
export default {
  name: 'bookCommutation',
  props: {
    memos: Array
  },
  data() {
    return {
    }
  },
  views: {
    Memo
  },
  methods: {}
}
</script>
<style scoped>
#container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
#button {
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 15px;
  margin-top: 10px;
  position: relative;
  left: 350px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  font-family: 'omyu_pretty';
}

#button:hover {
  background-color: #dfdfdf;
  color: black;
}

#table {
  border-collapse: collapse;
  width: 80%;
  max-width: 800px;
  background-color: white;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
}
</style>
