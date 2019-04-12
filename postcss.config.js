module.exports = {
  plugins: [
    require('autoprefixer')(), // 加 css 各浏览器前缀
    require('cssnano')(), // 优化 & 压缩 css
    require('postcss-cssnext')(), // 使用未来的 css 语法
    require('postcss-sprites')({ // 图片合并成一张图
      spritePath: 'dist/assets/imgs/sprites', // 输出路径
      retina: true // 处理苹果 retina 屏幕
    })
  ]
}
