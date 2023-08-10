<template>
  <div>
    <span>아이디<input type="text" /></span>
    <span>비밀번호<input type="text" /></span>
    <span>이름<input type="text" /></span>
    <span>e-mail<input type="text" /></span>
    <button @click="submit()">제출</button>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      input_id: '',
      input_pw: '',
      input_name: '',
      input_mail: ''
    }
  },
  methods: {
    submit() {
      axios.post('/login', {
        id: this.input_id
      })
    }
  }
}
</script>
<style></style>
