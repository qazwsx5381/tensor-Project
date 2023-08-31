app.get('/', (req, res) => {
//   axios({
//     url: 'https://www.aladin.co.kr/home/welcome.aspx',
//     method: 'GET'
//   })
//     .then((response) => {
//       const $ = cheerio.load(response.data)

//       const welcomeSection = $(
//         '.welcome_section3 .swiper-wrapper .swiper-slide'
//       )

//       const titles = welcomeSection
//         .find('.r_text .tit')
//         .map((index, element) => $(element).text())
//         .get()
//       const covers = welcomeSection
//         .find('.cover img')
//         .map((index, element) => $(element).attr('src'))
//         .get()
//       const subs = welcomeSection
//         .find('.r_text .sub')
//         .map((index, element) => $(element).text())
//         .get()

//       const data = titles.map((title, index) => ({
//         title,
//         cover: covers[index],
//         subtitle: subs[index]
//       }))
//       res.header('Access-Control-Allow-Origin', '*')
//       res.send(data)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.status(500).send('Internal Server Error')
//     })
// })

// // 이달의 주목도서 목록
// app.get('/', (req, res) => {
//   axios({
//     url: 'https://www.aladin.co.kr/home/welcome.aspx',
//     method: 'GET'
//   })
//     .then((response) => {
//       const $ = cheerio.load(response.data)

//       const monthBook = $('#w_monthBook_wrapper')

//       const titles = monthBook
//         .find('.text .tit')
//         .map((index, element) => $(element).text())
//         .get()
//       const covers = monthBook
//         .find('.cover img')
//         .map((index, element) => $(element).attr('src'))
//         .get()

//       const data = titles.map((title, index) => ({
//         title,
//         cover: covers[index]
//       }))
//       res.header('Access-Control-Allow-Origin', '*')
//       res.json(data)
//     })
//     .catch((err) => {
//       console.error(err)
//       res.status(500).send('Internal Server Error')
//     })
// })