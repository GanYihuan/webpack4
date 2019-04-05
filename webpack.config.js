const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 简化 HTML 文件的创建, 生成 html, 即使 css, js 文件名称变化 , 能自动加载配对的 css, js 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽离出 css 样式生成一个文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css 压缩
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩
const CleanWebpackPlugin = require('clean-webpack-plugin') // 每次打包都会删掉原来的并重新打包
const CopyWebpackPlugin = require('copy-webpack-plugin') // 拷贝文件
const Happypack = require('happypack')

module.exports = { // 开发服务器配置
  mode: 'production', // 开发模式 development/production
  entry: { // 入口
    index: './src/index.js',
    other: './src/other.js'
  },
  output: { // 出口
    filename: '[name].[hash:5].js', // 打包后文件名, 加入 hash 5位, [name] 对应 entry 定义的文件名称
    path: path.resolve(__dirname, 'dist') // 打包后文件放哪里, path.resolve 相对路径解析成绝对路径
    // publicPath: 'http://www.zhihu.cn' // 引入资源路径前面加的前缀
  },
  optimization: { // 优化项
    minimizer: [
      new UglifyJsWebpackPlugin({ // js 压缩
        cache: true, // 缓存
        parallel: true, // js 并发压缩
        sourceMap: true // 监控错误
      }),
      new OptimizeCssAssetsWebpackPlugin({}) // css 压缩
    ],
    splitChunks: { // 多页面 分割代码
      cacheGroups: { // 缓存组
        common: { // 公共模块
          chunks: 'initial', // 这表示将选择哪些块进行优化。当提供一个字符串时，有效值是all、async和initial
          minSize: 0, // 超过 0 个字节, 生成块的最小大小(以字节为单位)。
          minChunks: 2 // 用了 2 次以上, 模块分割前必须共享的最小块数。
        },
        vendor: { // 第三方模块
          priority: 1, // 先执行 权限高
          test: /node_modules/,
          chunks: 'initial', // 这表示将选择哪些块进行优化。当提供一个字符串时，有效值是all、async和initial
          minSize: 0, // 超过 0 个字节, 生成块的最小大小(以字节为单位)。
          minChunks: 2 // 用了 2 次以上, 模块分割前必须共享的最小块数。
        }
      }
    }
  },
  watch: true, // 实时监控打包
  watchOptions: {
    poll: 1000, // 监听间隔
    aggregateTimeout: 500, // 防抖
    ignored: /node_modules/ // 不需要监控
  },
  resolve: { // 解析第三方包
    modules: [path.resolve('node_modules')], // 找文件的位置
    extensions: ['.js', '.css', '.json', '.vue'], // 引入文件的后缀依次解析
    mainFields: ['style', 'main'], // 先找 **package.json** style 再找 main
    // mainFiles: [], // 入口文件名字 index.js
    alias: { // 别名
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
  devtool: 'cheap-module-source-map', // 源码映射会单独生成一个 sourcemap 文件 出错了会标识当前报错位置
  devServer: { // 开发服务器配置
    port: 8080, // 启动端口
    progress: true, // 运行过程
    hot: true, // 启动热更新
    open: true, // 自动打开浏览器
    compress: true, // 压缩
    contentBase: './build', // 指向 ./build 文件作为静态服务
    // proxy: { // 重写方式把请求代理到 express 服务上
    //   '/api': 'http://localhost:3000' // 1) 配置代理
    //   '/api': { // 2
    //     target: 'http://localhost:3000', // 配置代理
    //     pathRewrite: {'/api':''} // 重写路径
    //   }
    // }
    before(app) { // 提供的钩子，前端模拟数据
      app.get('/user', (req, res) => {
        res.json({ name: 'ganbefore' })
      })
    }
    // 3) 服务端启动 webpack
  },
  externals: { // webpack 不处理相关依赖库
    jquery: '$'
  },
  module: { // 模块, css, img... 转换为模块
    noParse: /jquery/, // 不需要解析
    rules: [ // 后往前 右往左 执行
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$' // 暴露全局的 loader
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js', // 多线打包
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 抽离出的 css 文件用 <link /> 标签引入
          {
            loader: 'css-loader' // 处理 css 文件, 如解析 @import 语法, 解析路径等
          },
          {
            loader: 'postcss-loader' // css 处理, autoprefixer: 加前缀
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // 动态创建 style 标签，塞到 <head></head> 标签里
            options: {
              insertAt: 'top' // 插入到 HTML 文件的顶部
            }
          },
          {
            loader: 'css-loader' // 处理 css 文件, 如解析 @import 语法, 解析路径等
          },
          {
            loader: 'postcss-loader' // css 处理, autoprefixer: 加前缀等功能
          },
          {
            loader: 'less-loader' // less 转化为 css
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
            loader: 'url-loader', // 将图片转换为 base64
            options: {
              limit: 3000, // 小于设置值时用 base64 来转化
              outputPath: '/img/' // 放置在 img 目录下
              // publicPath: 'http://wwww.zhihu.cn' // 引入资源路径前面加的前缀
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader' // html中直接使用img标签src加载图片的话，因为没有被依赖，图片将不会被打包。这个loader解决这个问题，图片会被打包，而且路径也处理妥当
          }
        ]
      }
    ]
  },
  plugins: [ // 放置 webpack 插件
    // **webpack.config.react.js**
    // new webpack.DllPlugin({ // 某种方法实现了拆分 bundles
    //   name: '_dll_[name]', // 暴露出的 Dll 的函数名
    //   path: path.resolve(__dirname, 'build', 'manifest.json')
    // })
    new webpack.DllReferencePlugin({ // 引入 DllPlugin 打包出来的资源
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板
      filename: 'index.html', // 打包后的文件名
      minify: { // 压缩 html
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true // html 里引入文件路径的名称加上 hash
    }),
    new MiniCssExtractPlugin({ // 抽离出 css 样式
      filename: 'css/main.css' // 抽离出的样式名称
    }),
    new webpack.ProvidePlugin({ // 在每个模块中都注入 $
      $: 'jquery'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
    new webpack.BannerPlugin('ganyihuan 2019'), // 版权信息
    new webpack.DefinePlugin({ // 定义环境变量
      DEV: JSON.stringify('production'), // string production
      FLAG: 'true', // boolean
      EXPRESSION: '1+1' // 2
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略 moment 里的 locale 包
    // new webpack.DllReferencePlugin({ // 引入 Dll 的函数名
    //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    // })
    new Happypack({ // js 用 Happypack 打包
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // 类和对象装饰器
              ['@babel/plugin-proposal-class-properties', { 'loose': true }], // 属性初始化
              ['@babel/plugin-transform-runtime'], // 能写 es6+ 新方法
              ['@babel/plugin-syntax-dynamic-import'] // 动态加载 import
            ]
          }
        },
        {
          loader: 'eslint-loader', // 放置 babel-loader 之后, eslint 校验代码格式
          options: {
            formatter: require('eslint-friendly-formatter') // 报错时输入内容的格式更友好
          },
          enforce: 'pre' // pre 先执行, post 后执行
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.NamedModulesPlugin() // module 的版本号从数字改成相对路径 有利于长缓存优化
  ]
}
