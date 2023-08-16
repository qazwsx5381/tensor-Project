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
          <tr v-for="(item, index) in tableData" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.nickname }}</td>
            <td>{{ item.content }}</td>
            <td>{{ item.views }}</td>
            <td>{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <button id="button">글쓰기</button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          nickname: '1',
          content: '안녕',
          views: 10,
          date: '2023-08-10'
        },
        {
          nickname: '2',
          content: '반갑',
          views: 15,
          date: '2023-08-11'
        }
      ]
    }
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
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
  font-weight: bold;
  margin-top: 10px;
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
