<template>
  <div id="container">
    <h3>정보를 공유해 주세요.</h3>
    <div id="memoContainer">
        <!-- <input type="file" id="file" style="display: none" /><label
          for="file"
          id="img-box"
          >+</label
        > -->
      <input type="text" id="title" placeholder="제목" />
      <textarea
        name=""
        id="textarea"
        cols="30"
        rows="10"
        placeholder="내용"
      ></textarea>
      <div id="buttonContainer">
        <button id="button" @click="routerLink()">글목록</button><br />
        <button id="ok" @click="addMemo()">등록</button>
        <button id="delete" @click="routerLink()">취소</button>
      </div>
    </div>
  </div>
</template>
<script>
import bookCommunity from './bookCommunity.vue'

export default {
  views: {
    bookCommunity
  },
  methods: {
    routerLink() {
      this.$router.push('/bookCommunity')
    },
    addMemo() {
      const newMemo = {
        title: this.title,
        content: this.memoContainer
      }

      this.$emit('memo-added', newMemo)
      this.memoContainer = ''
      this.title = ''
    }
  },
  data() {
    return {
      memoContainer: '',
      title: ''
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
  flex-direction: column;
}

input {
  margin: 5px;
}

#memoContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-family: 'omyu_pretty';
}

#title {
  width: 600px;
  height: 30px;
  font-family: 'omyu_pretty';
}

#textarea {
  width: 600px;
  height: 300px;
  resize: none;
  font-family: 'omyu_pretty';
}

#button {
  position: relative;
  right: 250px;
}

button {
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 15px;
  margin-top: 10px;
  margin: 5px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  font-family: 'omyu_pretty';
  font-size: 17px;
}

button:hover {
  background-color: #dfdfdf;
  color: black;
}
</style>
