const mycol = require('./mongo_ori')

const main = async () => {
  const _data = {
    albumId: 12012,
    id: 312,
    title: '배트맨',
    url: 'google.com',
    thumbnailUrl: 'https://naver.com'
  }
  const CRUD_C = new mycol(_data)
  const t = await CRUD_C.save()
  console.log(t)
}

main()
