<template>
  <section>
    <!-- 쿠키가 존재할 경우 -->
    <div v-if="isCookieSet">
      <!-- 게시글 목록 보여주기 -->
      <div v-if="DBload">
        <div id="container" v-if="DBload">
          <table id="table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>제목</th>
                <th>닉네임</th>
                <th>조회수</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, i) in displayedPosts" :key="i">
                <td>{{ v.boardnum }}</td>
                <td @click="showBoard(i)">{{ v.title }}</td>
                <td>{{ decodeURI(v.name) }}({{ v.id }})</td>
                <td>{{ v.load_count }}</td>
                <td>{{ timestamp(v.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <router-link to="Memo" id="link">
          <button id="button">글쓰기</button>
        </router-link>
        <div>
          <button
            id="pre_button"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            이전
          </button>
          <button
            id="pre_button"
            @click="nextPage"
            :disabled="currentPage === pageCount"
          >
            다음
          </button>
        </div>
      </div>
      <!-- 게시글 조회 -->
      <div v-if="load_dbContent && login_id">
        <div>{{ boardNum }}</div>
        <div>{{ title_board }}</div>
        <div>{{ content_board }}</div>
        <div>{{ writeDate }}</div>
        <div>{{ writeID }}</div>
        <div>{{ boardCount }}</div>
        <button id="pre_button" @click="loadContent()">목록</button>
        <button
          id="pre_button"
          :disabled="writeName != decodeURI(login_name) && writeID != login_id"
          @click="editBoard(boardNum)"
        >
          수정
        </button>
        <button
          id="pre_button"
          :disabled="writeName != decodeURI(login_name) && writeID != login_id"
          @click="delBoard(boardNum)"
        >
          삭제
        </button>
      </div>
      <!-- 게시글 수정 -->
      <div id="memoContainer" v-if="edit_dbContent && login_id">
        <div>
          <span class="text">제목</span>
          <input type="text" id="title" v-model="edit_title" />
        </div>
        <div>
          <span class="text">내용</span>
          <textarea
            name=""
            id="textarea"
            cols="30"
            rows="10"
            v-model="edit_content"
          ></textarea>
        </div>
        <div>
          <span class="text">작성자</span>
          <input id="title" type="text" v-model="edit_name" disabled />
        </div>
        <div>
          <button id="pre_button" @click="editDB()">수정</button>
          <button id="pre_button" @click="backContent(boardNum)">
            뒤로가기
          </button>
        </div>
      </div>
    </div>
    <!-- 쿠키가 존재하지 않을 경우 -->
    <div v-else>
      <h3>로그인 해주세요.</h3>
    </div>
  </section>
</template>
<script>
import Memo from './Memo.vue'
import axios from 'axios'
export default {
  name: 'bookCommutation',
  props: {
    memos: Array
  },
  data() {
    return {
      isCookieSet: false,
      DBload: true,
      load_dbContent: false,
      edit_dbContent: false,
      login_id: '',
      login_name: '',
      boardlist: '',
      itemsPerPage: 10, // 한 페이지에 보여줄 게시글 수
      currentPage: 1, // 현재 페이지 번호,
      title_board: '',
      content_board: '',
      writeDate: '',
      writeID: '',
      writeName: '',
      boardNum: '',
      boardCount: '',
      edit_title: '',
      edit_content: '',
      edit_name: ''
    }
  },
  views: {
    Memo
  },
  computed: {
    // 게시글 수에 따른 페이지 카운트
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
    loadBoard() {
      axios.post('/board_load').then((res) => {
        this.boardlist = res.data
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
    showBoard(event) {
      axios.post('/load_content', this.displayedPosts[event]).then((data) => {
        this.load_dbContent = true
        this.DBload = false
        const array = data.data[0]
        this.title_board = array.title
        this.content_board = array.content
        this.writeDate = this.timestamp(array.date)
        this.writeID = array.id
        this.writeName = decodeURI(array.name)
        this.boardNum = array.boardnum
        this.boardCount = array.load_count
      })
    },
    loadContent() {
      this.load_dbContent = false
      this.DBload = true
      this.$router.go(0)
    },
    delBoard(event) {
      axios.post('/delete', { count: event }).then(() => {
        alert('게시글이 삭제되었습니다.')
        this.$router.go(0)
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
        this.DBload = false
        this.load_dbContent = true
        this.edit_dbContent = false
      })
    },
    editBoard(boardnum) {
      axios.post('/edit', { boardnum }).then((res) => {
        const editdata = res.data[0]
        this.edit_title = editdata.title
        this.edit_content = editdata.content
        this.edit_name = editdata.id
        this.DBload = false
        this.load_dbContent = false
        this.edit_dbContent = true
      })
    },
    backContent(boardNum) {
      axios.post('/editcancel', { count: boardNum }).then((res) => {
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
        this.DBload = false
        this.load_dbContent = true
        this.edit_dbContent = false
      })
    }
  }
}
</script>
<style scoped>
#memoContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-family: 'omyu_pretty';
}

#memoContainer div {
  display: flex;
}
span.text {
  width: 150px;
  margin-bottom: 20px;
  line-height: 33px;
  text-align: right;
  margin-right: 15px;
}
#title {
  width: 600px;
  height: 30px;
  font-family: 'omyu_pretty';
  font-size: 20px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 1px solid black;
}

#textarea {
  width: 600px;
  height: 300px;
  font-size: 20px;
  resize: none;
  font-family: 'omyu_pretty';
  border: none;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  margin-bottom: 20px;
}

#title:focus {
  outline-style: none;
  border-bottom: 1px solid black;
}
#textarea:focus {
  outline-style: none;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

#title:disabled {
  color: #979797;
}

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

#pre_button {
  width: 100px;
  height: 30px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 15px;
  position: relative;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  font-family: 'omyu_pretty';
  margin: 0 10px;
}

#pre_button:hover {
  background-color: #dfdfdf;
  color: black;
}

#pre_button:hover:disabled {
  background-color: #979797;
}

#pre_button:disabled {
  background-color: #979797;
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
