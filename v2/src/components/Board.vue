<template>
  <div>
    <h2>글 작성</h2>
    <form @submit.prevent="submitPost">
      <input v-model="newPostTitle" placeholder="글 제목" />
      <button type="submit">작성</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPostTitle: ''
    }
  },
  methods: {
    submitPost() {
      // 글 작성 로직 수행 후
      // this.newPostTitle을 사용하여 새 글을 게시글 목록에 추가

      // 게시글 목록 갱신을 Board 컴포넌트에 요청
      this.$emit('post-submitted', {
        id: Date.now(), // 예시로 현재 시간을 ID로 사용
        title: this.newPostTitle
      })

      this.newPostTitle = '' // 작성한 글 제목 초기화
    }
  }
}
</script>
