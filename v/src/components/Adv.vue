<template>
  <div class="welcome-section">
    <header class="header">
      <h3>화제</h3>
    </header>
    <div class="controls-container">
      <!-- 이전 페이지로 이동하는 버튼 -->
      <button
        @click="prevPage"
        :disabled="currentPage === 0 && !circularNavigation"
        class="prev-button"
      >
        ◀
      </button>
      <!-- 책 목록을 표시하는 컨테이너 -->
      <div class="book-list">
        <div
          v-for="(item, index) in visibleBooks"
          :key="index"
          class="book-item"
        >
          <!-- 각 책 아이템의 내용을 표시 -->
          <div class="book-content">
            <div class="book-cover-container">
              <div class="image-wrapper">
                <!-- 책 표지 이미지 -->
                <img :src="item.cover" alt="Book Cover" class="book-cover" />
              </div>
            </div>
            <div class="book-info">
              <!-- 책 제목과 부제목 -->
              <h2 class="book-title">{{ item.title }}</h2>
              <p class="book-subtitle">{{ item.subtitle }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 다음 페이지로 이동하는 버튼 -->
      <button
        @click="nextPage"
        :disabled="currentPage === pageCount - 1 && !circularNavigation"
        class="next-button"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CombinedComponent',
  data() {
    return {
      welcomeData: [], // 책 목록 데이터를 저장하는 배열
      itemsPerPage: 3, // 페이지당 표시할 책 아이템 수
      currentPage: 0, // 현재 페이지 인덱스
      circularNavigation: true // 순환 형태의 페이지 이동 여부
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.welcomeData.length / this.itemsPerPage) // 총 페이지 수 계산
    },
    visibleBooks() {
      const start = this.currentPage * this.itemsPerPage // 현재 페이지 시작 인덱스
      const end = start + this.itemsPerPage // 현재 페이지 끝 인덱스
      return this.welcomeData.slice(start, end) // 현재 페이지에 해당하는 책 목록 반환
    }
  },
  mounted() {
    setInterval(() => {
      this.nextPage()
    }, 3000)
  },
  created() {
    this.fetchWelcomeData() // 컴포넌트 생성 시 책 목록 데이터를 불러옴
  },
  methods: {
    async fetchWelcomeData() {
      try {
        const response = await axios.post('/hotBook') // 책 목록 데이터를 서버에서 가져옴
        this.welcomeData = response.data
      } catch (error) {
        console.error(error)
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount - 1) {
        this.currentPage++ // 다음 페이지로 이동
      } else if (this.circularNavigation) {
        this.currentPage = 0 // 마지막 페이지에서 다음 버튼을 누를 경우, 첫 페이지로 이동 (순환)
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage-- // 이전 페이지로 이동
      } else if (this.circularNavigation) {
        this.currentPage = this.pageCount - 1 // 첫 페이지에서 이전 버튼을 누를 경우, 마지막 페이지로 이동 (순환)
      }
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 20px 0;
}
/* 헤더 스타일 */
.header {
  font-size: 24px;
}

/* 책 목록을 감싸는 컨테이너 스타일 */
.book-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

/* 각 책 아이템의 스타일 */
.book-item {
  width: 300px;
  height: 300px;
  padding: 5px 20px;
  border: 1px solid lightgray;
  text-align: center;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  overflow: hidden; /* 내용이 넘칠 경우 숨기기 */
}

/* 책 표지 이미지 컨테이너 스타일 */
.book-cover-container {
  display: flex;
  justify-content: center;
}

/* 이미지 컨테이너 내부 래핑 스타일 */
.image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 책 표지 이미지 스타일 */
.book-cover {
  width: 150px;
  height: 220px;
  border: 1px solid #000;
}

/* 책 제목 스타일 */
.book-title {
  font-size: 19px;
  margin: 10px 0;
}

/* 책 부제목 스타일 */
.book-subtitle {
  color: gray;
  margin: 0;
}

/* 책 내용 컨테이너 스타일 */
.book-content {
  display: flex;
  align-items: center;
}

/* 책 정보 컨테이너 스타일 */
.book-info {
  flex: 1;
  padding-left: 20px;
  text-align: left;
}

/* 페이지 컨트롤 버튼 컨테이너 스타일 */
.controls-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 1200px;
  margin: auto;
}

/* 페이지 컨트롤 버튼 스타일 */
.controls-container button {
  font-size: 25px;
  padding: 8px 15px;
  background: linear-gradient(45deg, #ffffff, #9c9c9c);
  color: white;
  border: none;
  border-radius: 33px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 비활성화된 버튼 스타일 */
.controls-container button:disabled {
  background: linear-gradient(45deg, #ccc, #ddd);
  cursor: not-allowed;
  box-shadow: none;
}

/* 버튼 호버 스타일 */
.controls-container button:hover {
  background: linear-gradient(45deg, #8a8a8a, #a8a8a8);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 이전 버튼 스타일 */
.controls-container .prev-button {
  margin-right: 0px; /* 오른쪽 마진을 추가하여 버튼 간 간격을 조정 */
}

/* 다음 버튼 스타일 */
.controls-container .next-button {
  margin-left: 0px; /* 왼쪽 마진을 추가하여 버튼 간 간격을 조정 */
}
</style>
-->
