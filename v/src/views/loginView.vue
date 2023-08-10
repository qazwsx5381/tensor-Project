<template>
  <div>
    <div>아이디<input type="text" v-model="input_id" /></div>
    <div>비밀번호<input type="password" v-model="input_pw" /></div>
    <div>이름<input type="text" v-model="input_name" /></div>
    <div>e-mail<input type="text" v-model="input_mail" /></div>
    <button
      v-if="
        input_id != '' && input_pw != '' && input_name != '' && input_mail != ''
      "
      @click="submit()"
    >
      제출
    </button>
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
        id: this.input_id,
        pw: this.input_pw,
        name: this.input_name,
        mail: this.input_mail
      })
    }
  }
}
</script>
<style></style>
