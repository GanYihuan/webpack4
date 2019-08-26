/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-04-05 01:06:06
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-14 22:15:22
 */
const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包分析, webpack-bundle-anlayzer stats.json
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin') // 每次打包都会删掉原来的并重新打包
const CopyWebpackPlugin = require('copy-webpack-plugin') // 拷贝文件
const Happypack = require('happypack') // 多线打包
// const HtmlWebpackInlineChunkPlugin = require('html-webpack-inline-chunk-plugin') // chunk 加到 html, 提前载入 webpack 加载代码 bug!
const HtmlWebpackPlugin = require('html-webpack-plugin') // 创建 HTML 文件, 把打包生成的 js 自动引入到该 HTML 文件中
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 CSS 提取到单独的文件中
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css 压缩
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩

module.exports = {
  mode: 'production', // 开发模式 development/production
  entry: { // 入口
    index: './src/index.js',
    other: './src/other.js'
  },
  output: { // 出口
    filename: '[name].[hash:5].js', // 生成文件的名称, 加入 hash 5位, [name] 对应 entry 定义的文件名称
    chunkFilename: '[name].[contenthash].js', // 非入口 chunk 文件的名称 (间接引入, 查看 html 如果没引入就是间接引入) contenthash: 代码不变则该生成的号码也不变
    publicPath: 'http://www.zhihu.cn', // 打包后文件名前面加前缀
    path: path.resolve(__dirname, 'dist'), // 打包后文件放哪里 (path.resolve 相对路径解析成绝对路径)
    library: 'MyLibrary', // 暴露 library <script src="MyLibrary.js"></script>
    libraryTarget: 'umd' // 控制以不同形式暴露 (umd: 在 AMD 或 CommonJS require 之后可访问)
  },
  optimization: { // 优化项
    runtimeChunk: { // manifest 提取放入 runtime 文件中, (manifest: 管理所有模块的交互)
      name: 'runtime'
    },
    usedExports: true, // import 的模块被使用了才打包
    minimizer: [
      new UglifyJsWebpackPlugin({ // js 压缩
        sourceMap: true, // 监控错误
        cache: true, // 缓存
        parallel: true // 并发压缩
      }),
      new OptimizeCssAssetsWebpackPlugin({}) // css 压缩
    ],
    splitChunks: { // 多页面分割代码
      chunks: 'all', // 选择哪些块。有效值是 all async initial
      minSize: 30000, // 大于 30kb 才分割
      minChunks: 1, // 模块被使用了至少 1 次后进行代码分割, Infinity 不会将任何模块打包进去
      maxAsyncRequests: 5, // 限制异步模块内部的并行最大请求数
      maxInitialRequests: 3, // 限制入口的拆分数量
      automaticNameDelimiter: '~', // 分割生成的文件之间的连接符
      name: true, // 分割块的名称。提供 true 将根据块和缓存组键自动生成名称
      cacheGroups: { // 缓存组
        vendors: {
          priority: 1, // 优先级对比 default 高
          test: /[\\/]node_modules[\\/]/, // import 的文件是否来自 node_modules
          filename: 'vendors.js', // 代码分割后生成文件名字
          chunks: 'initial', // 选择哪些块。有效值是 all async initial
          minSize: 0,
          minChunks: 2
        },
        default: {
          priority: -1,
          filename: 'common.js',
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          reuseExistingChunk: true // 如果模块被打包了，会忽略该模块
        }
      }
    }
  },
  watch: true, // 实时监控打包
  watchOptions: {
    poll: 1000, // 监听间隔
    aggregateTimeout: 500, // 检测文件不再发生变化会先缓存起来，等待一段时间，通知监听者
    ignored: /node_modules/ // 不需要监控
  },
  resolve: { // 配置模块如何解析
    modules: [path.resolve('node_modules')], // 模块查找路径
    extensions: ['.js', '.css', '.json', '.vue'], // 自动解析确定的扩展
    mainFields: ['style', 'main'], // 当从 npm 包中导入模块时, 在 package.json 中使用哪个字段导入模块
    alias: { // 创建 import 或 require 的别名
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
  devtool: 'cheap-module-source-map', // 生产选择, 不会产生列，是一个单独的映射文件
  // devtool: 'cheap-module—eval-source-map', // 开发选择, 不会产生文件和列，集成在在打包后的文件中
  devServer: { // 开发服务器配置
    port: 8080, // 启动端口
    inline: false, // 构建消息将会出现在浏览器控制台
    progress: true, // 运行过程
    compress: true, // 压缩
    hot: true, // 启动热更新
    hotOnly: true, // 在构建失败时不刷新页面作为回退 (即使 html 构建失效不刷新)
    open: true, // 告诉 dev-server 在 server 启动后打开浏览器
    openPage: '', // 指定打开浏览器时的导航页面
    https: true, // 默认情况下, dev-server 通过 HTTP 提供服务 使用自签名证书
    overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    lazy: true, // 在请求时才编译包 webpack 不会监视任何文件改动
    contentBase: './build', // ./build 文件作为静态文件服务
    // historyApiFallback: true,
    historyApiFallback: { // 404 响应被替代为 index.html
      // htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], // 指定文件类型, 匹配了才重定向
      rewrites: [ // 重定向规则
        {
          from: /\.*/,
          to: '/404.html'
        }
      ]
    },
    proxy: { // 重写方式把请求代理到 express 服务上
      '/react/api': { // axios.get('/react/api/header.json')
        target: 'https://m.weibo.cn', // 请求远端服务器数据
        changeOrigin: true, // 默认情况下代理时保留主机头的原点, 您可以将 changeOrigin 设置为 true 以覆盖此行为
        headers: { // http 请求头
          Cookie: 'M_WEIBOCN_PARAMS=luicode%3D20000174%26lfid%3D102803_ctg1_7978_-_ctg1_7978%26uicode%3D20000174%26fid%3D102803_ctg1_7978_-_ctg1_7978; expires=Sun, 25-Nov-2018 16:18:59 GMT; Max-Age=600; path=/; domain=.weibo.cn; HttpOnly'
        },
        logLevel: 'debug', // 控制台显示代理信息
        pathRewrite: { // 重定向接口请求
          'header.json': 'demo.json'
        }
      }
    },
    before(app) { // 提供的钩子, 前端模拟数据
      app.get('/user', (req, res) => {
        res.json({ name: 'ganbefore' })
      })
    }
    // 3) 服务端启动 webpack
  },
  externals: { // webpack打包时，会忽略掉jquery
    jquery: '$'
  },
  module: { // 模块, css, img... 转换为模块
    noParse: /jquery/, // 防止 webpack 解析那些任何与给定正则表达式相匹配的文件
    rules: [ // 后往前 右往左 执行
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/
      // },
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$' // 暴露全局的 loader
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js', // 多线打包
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 抽离出的 css 文件用 <link /> 标签引入
          {
            loader: 'css-loader' // 分析几个 css 文件然后合并成一个, 如解析 @import 语法
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
              sourceMap: true, // singleton 会阻止 sourceMap
              singleton: true, // singleton (是否只使用一个 style 标签)
              modules: true, // 使样式不是全局
              insertAt: 'top', // 插入到 HTML 文件的顶部
              insertInto: '#app', // 插入 dom 位置
              transform: './css.transform.js' // 插入页面前执行
            }
          },
          {
            loader: 'css-loader', // 处理 css 文件然后合并成一个, 如解析 @import 语法
            options: {
              sourceMap: true,
              importLoaders: 2 // 对于 @import ''; 情况处理, 一定要走下面两个 loader
            }
          },
          {
            loader: 'postcss-loader', // css 处理, autoprefixer: 加前缀等功能
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader', // less 转化为 css
            options: {
              sourceMap: true
            }
          }
        ]
      },
      { // 处理图片
        test: /\.(png|jpg|jpeg|gif)$/,
        // use: [
        //   {
        //     loader: 'file-loader' // 把文件挪动到打包目录下，文件地址返回给变量
        //   },
        // ]
        use: [
          {
            loader: 'url-loader', // 将图片转换为 base64
            options: {
              name: '[name]-[hash:5].[ext]', // 生成的图片名称
              limit: 2048, // 大于 2048 处理成 base64
              publicPath: '', // 引入资源路径前面加的前缀 ''
              outputPath: 'dist/', // 放置在 dist 文件夹下
              useRelativePath: true // 放置在 assets/imgs, 因为图片原本路径为 (aseets/imgs)
            }
          }
        ]
      },
      { // 处理字体文件
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000,
              outputPath: 'assets/imgs/'
            }
          },
          { // 压缩图片
            loader: 'img-loader',
            options: {
              pngquant: { // .png 图片处理
                quality: 80 // 压缩 png
              }
            }
          }
        ]
      },
      { // 处理 html
        test: /\.html$/,
        use: [
          {
            loader: 'html-withimg-loader' // html 中使用 img 标签 src 加载图片
          }
        ]
      }
      // { // 第三方库处理
      //   test: path.resolve(__dirname, './src/app.js'),
      //   use: [
      //     { // use modules that depend on specific global variables
      //       loader: 'imports-loader',
      //       options: {
      //         $: 'jquery'
      //       }
      //     }
      //   ]
      // }
    ]
  },
  plugins: [
    // **webpack.config.react.js**
    // new webpack.DllPlugin({ // 某种方法实现了拆分 bundles
    //   name: '_dll_[name]', // 暴露出的 Dll 的函数名
    //   path: path.resolve(__dirname, 'build', 'manifest.json')
    // })
    // new webpack.DllReferencePlugin({ // 引入 DllPlugin 打包出来的资源
    //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    // }),
    // new HtmlWebpackInlineChunkPlugin({ // chunk 加到 html, 提前载入 webpack 加载代码
    //   inlineChunks: ['manifest']
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板
      filename: 'index.html', // 处理后生成文件名称
      minify: { // 压缩 html
        removeAttributeQuotes: true, // 删除双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true // html 里引入的文件路径名称加上 hash
    }),
    new MiniCssExtractPlugin({ // 抽离出 css 样式
      filename: 'css/main.css', // 处理后生成文件的名称
      chunkFilename: '[name].chunk.css' // 非入口 chunk 文件的名称 (间接引入, 查看 html 如果没引入就是间接引入)
    }),
    new Happypack({ // js 用 Happypack 打包
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { useBuiltIns: 'usage' }] // useBuiltIns 按需处理
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // 类和对象装饰器
              ['@babel/plugin-proposal-class-properties', { 'loose': true }], // 属性初始化
              ['@babel/plugin-transform-runtime'], // 能写 es6+ 新方法, 写库的时候用
              ['@babel/plugin-syntax-dynamic-import'] // 动态加载 import
            ]
          }
        },
        {
          loader: 'imports-loader?this=>window' // console.log(this === window) 返回 true
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
    new WebpackBundleAnalyzerPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.NamedModulesPlugin(), // module 的版本号从数字改成相对路径 有利于长缓存优化
    new webpack.NamedChunksPlugin(), // chunk 的版本号从数字改成文件名字
    new webpack.BannerPlugin('ganyihuan 2019'), // 版权信息
    new webpack.DefinePlugin({ // 定义环境变量
      DEV: JSON.stringify('production'), // string production
      FLAG: 'true', // boolean
      EXPRESSION: '1+1' // 2
    }),
    new webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略 moment 里的 locale 包
    new webpack.ProvidePlugin({ // 使用了 $, 则自动 import jquery
      $: 'jquery',
      _: 'lodash',
      _join: ['lodash', 'join']
    })
  ]
}
