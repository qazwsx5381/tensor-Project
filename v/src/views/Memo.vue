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
    </div>
    <div id="buttonContainer">
      <button id="button" @click="routerLink()">글목록</button><br />
      <button id="ok" @click="addMemo()">등록</button>
      <button id="delete" @click="routerLink()">취소</button>
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
}

#title {
  width: 800px;
  height: 30px;
  align-self: center;
}

#textarea {
  width: 800px;
  align-self: center;
  resize: none;
}

#button {
  position: relative;
  right: 350px;
}

button {
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 15px;
  font-weight: bold;
  margin-top: 10px;
  margin: 5px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}

button:hover {
  background-color: #dfdfdf;
  color: #fff;
}

#img-box {
  display: inline-block;
  width: 35px;
  height: 35px;
  border: 1px solid #8388e1;
  border-radius: 5px;
  margin-top: 4px;
}
</style>
