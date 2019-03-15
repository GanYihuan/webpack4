let webpack = require('webpack')
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽离出 css 样式为一个文件
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css 压缩
let UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩

module.exports = { // 开发服务器配置
  mode: 'production',
  entry: './src/index.js', // 入口
  output: {
    filename: 'bundle.[hash:5].js', // 打包后文件名, 加入 hash 5位
    path: path.resolve(__dirname, 'build') // 打包后文件放哪里, 路径必须是一个绝对路径, path.resolve 相对路径解析成绝对路径
    // publicPath: 'http://www.zhihu.cn' // 引入资源路径前面加的前缀
  },
  optimization: { // 优化项
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true, // 缓存
        parallel: true, // 并发压缩
        sourceMap: true // 监控错误
      }),
      new OptimizeCssAssetsWebpackPlugin({})
    ]
  },
  devServer: {
    port: 8080,
    progress: true,
    contentBase: './build', // 指向 build 文件找到文件夹
    compress: true, // 压缩
  },
  // externals: { // webpack 不处理依赖库
  //   jquery: '$'
  // },
  module: {
    rules: [ // 后往前 右往左 执行
      // {
      //   test: require.resolve('jquery'),
      //   use: 'expose-loader?$' // 暴露全局的 loader 内联 loader
      // },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [ // es6 -> es5
                '@babel/preset-env'
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { 'legacy': true }], // 类和对象装饰器
                ['@babel/plugin-proposal-class-properties', { 'loose': true }], // 属性初始化
                ['@babel/plugin-transform-runtime']
              ]
            }
          }
        ],
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 抽离出的 css 文件用 link 标签引入
          { // 让 js 能 @ import css 文件进来
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          { // style-loader 动态创建 style 标签，塞到 head 标签里
            loader: 'style-loader',
            options: {
              insertAt: 'top' // 插入到顶部
            }
          },
          { // 让 js 能 @ import css 文件进来
            loader: 'css-loader'
          },
          { // css 处理, autoprefixer: 加前缀
            loader: 'postcss-loader'
          },
          {
            // less -> css
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        // use: [
        //   {
        //     loader: 'file-loader' // 默认会在内部生成一张图片到 build 目录把生成的图片名字返回回来
        //   },
        // ]
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1, // 小于设置值时用 base64 来转化
              outputPath: '/img/', // 放置在 img 目录下
              publicPath: 'http://wwww.zhihu.cn' // 引入资源路径前面加的前缀
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader'
          }
        ]
      }
    ]
  },
  plugins: [ // 放置 webpack 插件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板
      filename: 'index.html', // 打包后的文件名
      minify: { // 压缩
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true
      },
      hash: true // 引入文件名称加上 hash
    }),
    new MiniCssExtractPlugin({ // 抽离出 css 样式
      filename: 'css/main.css'
    }),
    new webpack.ProvidePlugin({ // 在每个模块中都注入 $
      $: 'jquery'
    })
  ]
}
