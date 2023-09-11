<template>
  <div>
    <div v-if="isCookieSet">
      <table>
        <tr>
          <th>글번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일시</th>
          <th>조회수</th>
        </tr>
        <tr v-for="(v, i) in displayedPosts" :key="i">
          <td>{{ v.boardnum }}</td>
          <td @click="showBoard(i)">{{ v.title }}</td>
          <td>{{ v.id }}</td>
          <td>{{ timestamp(v.date) }}</td>
          <td>{{ v.load_count }}</td>
        </tr>
      </table>
      <div>
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <button @click="nextPage" :disabled="currentPage === pageCount">
          다음
        </button>
      </div>
      <button>글작성</button>
    </div>
    <p v-else>로그인을 해주세요</p>
    <div v-if="login_id">
      <input type="text" v-model="title" /> <br />
      <input type="text" v-model="content" /><br />
      <input type="text" v-model="login_id" disabled /><br />
      <button @click="sendBoard()">저장</button>
    </div>
    <div v-if="load_dbContent && login_id">
      <div>{{ boardNum }}</div>
      <div>{{ title_board }}</div>
      <div>{{ content_board }}</div>
      <div>{{ writeDate }}</div>
      <div>{{ writeID }}</div>
      <button @click="load_dbContent = !load_dbContent">취소</button>
      <button
        :disabled="writeName != decodeURI(login_name) && writeID != login_id"
        @click="editBoard(boardNum)"
      >
        수정
      </button>
      <button
        :disabled="writeName != decodeURI(login_name) && writeID != login_id"
        @click="delBoard(boardNum)"
      >
        삭제
      </button>
    </div>
    <div>
      <input type="text" v-model="edit_title" /><br /><input
        type="text"
        v-model="edit_content"
      /><br /><input type="text" v-model="edit_name" disabled /><br />
      <button @click="editDB()">수정</button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      isCookieSet: false,
      load_dbContent: false,
      login_id: '',
      login_name: '',
      boardlist: '',
      num: '',
      itemsPerPage: 10, // 한 페이지에 보여줄 게시글 수
      currentPage: 1, // 현재 페이지 번호,
      title: '',
      content: '',
      title_board: '',
      content_board: '',
      writeDate: '',
      writeID: '',
      writeName: '',
      boardNum: '',
      edit_title: '',
      edit_content: '',
      edit_name: ''
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.boardlist.length / this.itemsPerPage) // 총 페이지 수 계산
    },
    displayedPosts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.boardlist.slice(start, end) // 현재 페이지에 해당하는 게시글 추출
    }
  },
  created() {
    this.checkCookieStatus() // 컴포넌트가 생성되면서 초기 확인 실행
    setInterval(this.checkCookieStatus, 500)
  },
  mounted() {
    this.loadBoard()
    setInterval(this.loadBoard(), 500)
  },
  methods: {
    checkCookieStatus() {
      this.isCookieSet = document.cookie
      const cookie = document.cookie.split('=')
      this.login_id = document.cookie ? cookie[0] : ''
      this.login_name = document.cookie ? cookie[1] : ''
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    sendBoard() {
      const content = {
        id: this.login_id,
        name: this.login_name,
        title: this.title,
        content: this.content,
        date: new Date(),
        boardnum: ''
      }
      axios.post('/board', content).then((res) => {
        alert('저장되었습니다.')
        this.title = ''
        this.content = ''
      })
    },
    loadBoard() {
      axios.post('/board_load').then((res) => {
        this.boardlist = res.data
      })
    },
    showBoard(event) {
      axios.post('/load_content', this.displayedPosts[event]).then((data) => {
        this.load_dbContent = true
        const array = data.data[0]
        this.title_board = array.title
        this.content_board = array.content
        this.writeDate = this.timestamp(array.date)
        this.writeID = array.id
        this.writeName = decodeURI(array.name)
        this.boardNum = array.boardnum
      })
    },
    timestamp(event) {
      const arr = event.substring(0, event.length - 5).split('T')
      const arr1 = arr[1].split(':')
      return (
        arr[0] +
        ' ' +
        (Number(arr1[0]) + 9 < 10
          ? '0' + (Number(arr1[0]) + 9)
          : Number(arr1[0]) + 9) +
        ':' +
        arr1[1] +
        ':' +
        arr1[2]
      )
    },
    delBoard(event) {
      axios.post('/delete', { count: event }).then(() => {
        alert('게시글이 삭제되었습니다.')
      })
    },
    editBoard(boardnum) {
      axios.post('/edit', { boardnum }).then((res) => {
        const editdata = res.data[0]
        this.edit_title = editdata.title
        this.edit_content = editdata.content
        this.edit_name = editdata.id
      })
    },
    editDB() {
      const send = {
        title: this.edit_title,
        content: this.edit_content,
        id: this.writeID,
        name: this.writeName,
        boardnum: this.boardNum
      }
      axios.post('/editBoard', send).then((res) => {
        const array = res.data[0]
        this.title_board = array.title
        this.content_board = array.content
        this.writeDate = this.timestamp(array.date)
        this.writeID = array.id
        this.writeName = decodeURI(array.name)
        this.boardNum = array.boardnum
        this.edit_title = ''
        this.edit_content = ''
        this.edit_name = ''
      })
    }
  }
}
</script>
<style scoped></style>
