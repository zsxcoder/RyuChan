import type { FeedGroup } from "../types/feed";

export default [
  {
    name: "网上邻居",
    entries: [
      {
        author: "纸鹿本鹿",
        sitenick: "纸鹿摸鱼处",
        desc: "纸鹿至麓不知路，支炉制露不止漉",
        link: "https://blog.zhilu.site/",
        avatar: "https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/image.8ok4l9tqge.webp",
        date: "2025-09-03",
        qrcode: "https://cdn.atao.cyou/Web/qrcode_zhilu.png",
        recommend: true,
      },
      {
        author: "ATao",
        sitenick: "ATao-Blog",
        desc: "做自己喜欢的事",
        link: "https://blog.atao.cyou",
        avatar: "https://cdn.atao.cyou/Web/Avatar.png",
        qrcode: "https://mcyzsx.github.io/picx-images-hosting/links/atao.1hsn7l8mie.webp",
        date: "2025-09-09",
        recommend: true,
      },
      // …想加继续往下写
    ],
  },
//   {
//     name: "程序猿",
//     entries: [
//       // 另一组
//     ],
//   },
] satisfies FeedGroup[];
