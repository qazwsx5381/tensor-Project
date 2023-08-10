const mycol = require('./mongo_ori')

const main = async () => {
  const t = await mycol
    .find(
      {
        title: /^슈/
      },
      { _id: 0, __v: 0 }
    )
    .lean() // p349 설명 효율적 메소드
  console.log(t)
}

main()
