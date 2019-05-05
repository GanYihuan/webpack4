# webpack4

## 目录

- 基本概念
- placeholders
- package.json
- 编译 ES6/ES7
- 代码分割
- 提取 CSS
- optimization
- Tree-shaking
- 懒加载
- 处理 HTML
- 处理 CSS
- 处理图片
- 处理字体
- ESlint
- source map
- watch
- devServer
- 每次打包都会删掉原来的并重新打包
- 拷贝文件
- 版权信息
- 定义环境变量
- 打包分析
- 优化打包速度
  1. 动态链接库
  2. library
  3. 忽略某些包
- 长缓存优化
- 开发环境 & 生产环境

## 基本概念

- entry: 某段代码入口 , 打包入口
- output: 输出
- loaders: 文件转化为模块
- plugins: 参与打包过程
- chunk: 代码块
- bundle: 打包生成的文件
- module: 模块, css, img 转换为模块
- 打包: webpack --config webpack-config.js ; npx webpack ; npx webpack --config webpack.config.my.js // 运行自定义名称配置文件
- yarn init: 初始化项目

## placeholders

1. [ext] 目标文件/资源的文件扩展名
2. [name] 文件/资源的基本名称
3. [hash] 指定生成文件内容哈希值的哈希方法。

```js
name: '[name]-[hash:5].[ext]', // 生成的图片名称, 加入 hash 5位
```

## package.json

- sideEffects: 让 webpack 去除 tree shaking 带来副作用的代码

```json
  "sideEffects": [
    "@babel/prolly-fill" ,
    "*.css"
  ],
  "scripts": {
    "dev-build": "webpack --config ./build/webpack.common.js",
    "dev": "webpack-dev-server --config ./build/webpack.common.js",
    "build": "webpack --env.production --config ./build/webpack.common.js",
    "server": "node server.js"
  },
```

```node
yarn add
webpack
webpack-cli
webpack-dev—server
webpack-dev-middleware
webpack—merge
webpack-hot-middleware
imports-loader
css-loader
style-loader
url-loader
file-loader
less
less-loader
sass-loader
node-sass
stylus
stylus-loader
mini-css-webpack-plugin
postcss
postcss-loader
autoprefixer
cssnano
postcss-cssnext
optimize-css-assets-webpack-plugin
uglifyjs-webpack-plugin
babel-core
babel-loader
@babel/core
@babel/preset-env
@babel/plugin-proposal-class-properties
@babel/plugin-proposal-decorators
@babel/plugin-transform-runtime
@babel/plugin-syntax-dynamic—import
eslint
eslint-loader
eslint-friendly-formatter
eslint-plugin-html
babel-eslint
html-withimg-loader
clean-webpack-plugin
copy-webpack-plugin
http-proxy-middleware
connect-history-api-fallback
parallel-webpack
bootstrap
moment
jquery
express
opn
react
react-dom
happypack
tapable
-D
````

```node
yarn add
@babel/runtime
@babel/polyfill
-S
```

## 编译 ES6/ES7

- babel-loader 这个包允许使用 babel 和 webpack 编译 JavaScript 文件
- babel-core 编译器核心
- babel-preset-env 将 ES6 的代码转成 ES5, env 包含所有规范 , es2015, es2016, es2017, 针对语法
- babel-preset 规范的总结, 针对语法
- babel-polyfill 全局垫片污染全局 , 能写 es7/ 8 新方法 , 适合开发应用使用, 引用 `import babel-polyfill`, 针对方法
- babel-plugin-transform-runtime, 局部垫片不会污染全局 , 能写 es7/ 8 新方法 , 适合在开发组件类库中使用 .babelrc 文件中配置, 针对方法
- .babelrc

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions"]
        }
      }
    ]
  ],
  "plugins": ["@babel/transform-runtime"]
}
```

- @babel/plugin-proposal-decorators 将类和对象装饰器编译到 ES5
- @babel/plugin-proposal-class-properties 这个插件转换静态类属性以及用属性初始化器语法声明的属性
- @babel/plugin-syntax-dynamic-import 解析 import() 语法

```js
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy': true }], // 类和对象装饰器
              ['@babel/plugin-proposal-class-properties', { 'loose': true }], // 属性初始化
              ['@babel/plugin-transform-runtime'], // 能写 es6+ 新方法
              ['@babel/plugin-syntax-dynamic-import'] // 动态加载 import
            ]
```

## 代码分割

- webpack4 删除了 webpack.optimize.CommonsChunkPlugin

```js
  optimization: { // 优化项
    splitChunks: { // 多页面分割代码
      chunks: 'all', // 这表示将选择哪些块进行优化。当提供一个字符串时，有效值是 all async initial
      minSize: 30000, // 大于该值才分割
      minChunks: 1, // 模块被使用了 ? 次后进行代码分割, Infinity 不会将任何模块打包进去
      maxAsyncRequests: 5, // 同时加载的模块数最多是
      maxInitialRequests: 3, // 入口文件进行加载时, 入口文件引入的库最多分割几个
      automaticNameDelimiter: '~', // 分割生成的文件之间的连接符
      name: true, // 让 cacheGroups 里面的名字有效
      cacheGroups: { // 缓存组
        vendors: { // 第三方模块
          priority: 1, // 优先级对比 default 高
          test: /[\\/]node_modules[\\/]/, // import 的文件是否来自 node_modules
          filename: 'vendors.js', // 代码分割后生成文件名字
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        },
        default: { // 默认模块
          priority: -1,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          reuseExistingChunk: true // 如果模块被打包了，会忽略该模块
        }
      }
    }
  },
```

## 提取 CSS

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽离出 css 样式生成一个文件

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 抽离出的 css 文件用 <link /> 标签引入
          {
            loader: 'css-loader'
          }
        ]
      },

    new MiniCssExtractPlugin({
      filename: '[name].css' , // html 直接引用 , 抽离出的样式名称
      chunkFilename: '[name].chunk.css' // html 间接引用 , 抽离出的样式名称
    })
```

## optimization

```js
  optimization: { // 优化项
    runtimeChunk: { // manifest 抽离放入 runtime 文件中, (manifest: 管理所有模块的交互)
      name: 'runtime'
    },
    usedExports: true, // 那些模块导出的模块被使用了才打包
```

## Tree-shaking

- js, css, html 压缩

```js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 简化 HTML 文件的创建 , 即使 css, js 文件名称变化 , 能自动加载配对的 css, js 文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // css 压缩
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩

  optimization: {
    minimizer: [
      new UglifyJsWebpackPlugin({
        cache: true , // 缓存
        parallel: true , // js 并发压缩
        sourceMap: true // 监控错误
      }),
      new OptimizeCssAssetsWebpackPlugin({}) // css 压缩
    ],

    new HtmlWebpackPlugin({
      template: './src/index.html' , // 模板
      filename: 'index.html' , // 打包后的文件名
      minify: { // html 压缩
        removeAttributeQuotes: true , // 删除双引号
        collapseWhitespace: true // 变成一行
      },
      hash: true // html 里引入文件路径的名称加上 hash
    }),
```

## 懒加载

- require.include()

```js
/* 引入模块 , 但不执行 , 提前加载第三方模块 , 减少加载次数 */
require.include('./moduleA.js')
```

- require.ensure()

```js
/*
动态加载模块 , 懒加载
把没有使用过的 require 资源进行独立分成一个 js 文件
['./subPageA.js']: dependencies( 不执行代码 )
callback( 执行代码 )
errorCallback( 可省略 )
chunkName
*/
require.ensure(
  ['./subPageA.js'],
  function() {
    let subPageA = require('./subPageA')
  },
  /* errorCallback ( 可省略 ) */
  'subPageA'
)
```

- import
**webpack.config.js**
plugin-syntax-dynamic-import

```js
if (page === 'subPageA') {
  /* 动态 import 会马上执行代码,  webpackChunkName 起一个 chunk 名字 subpageA ，打包生成的文件 */
  import(/* webpackChunkName: 'subpageA */ './subPageA').then(function())
}
```

## 处理 HTML

```js
      {
        test: /\.html$/ ,
        use: [
          {
            loader: 'html-withimg-loader' // html 中直接使用 img 标签 src 加载图片的话，因为没有被依赖，图片将不会被打包。这个 loader 解决这个问题，图片会被打包，而且路径也处理妥当
          }
        ]
      }
```

## 处理 CSS

- style-loader

```js
        use: [ // 处理过程 , 从后往前
          {
            loader: 'style-loader', // 动态创建 style 标签，塞到 head 标签里
            options: {
              sourceMap: true, // singleton 会阻止 sourceMap
              singleton: true, // singleton( 是否只使用一个 style 标签 )
              insertAt: 'top', // 插入到 HTML 文件的顶部
              insertInto: '#app', // 插入 dom 位置
              transform: './css.transform.js' // 插入页面前执行
            }
          },
```

- style-loader/url

```js
        use: [ // 处理过程 , 从后往前
          {
            loader: 'style-loader/url', // 在最后生成的 js 文件中进行处理，动态创建 link 标签，塞到 head 标签里 , 不能处理多样式
```

- style-loader/useable

```js
        use: [ // 处理过程 , 从后往前
          {
            loader: 'style-loader/useable', // 控制样式是否插入页面中 , 多了 .use() & .unuse() 方法
```

```js
import base from './css/base.less'
var flag = false
setInterval( function () {
  if (flag) {
    base.unuse()
    flag = false
  } else {
    base.use()
  }
  flag = !flag
}, 1000)
```

- css-loader

```js
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2 // 一定要走下面两个 loader
            }
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
```

- less 处理

```js
      {
        test: /\.less$/,
        use: [
          {
            loader: 'less-loader' // less 转化为 css , 放置 css-loader 下面
          }
        ]
      },
```

- PostCSS

1. autoprefixer 加 css 各浏览器前缀
2. cssnano 优化 & 压缩 css
3. postcss-cssnext 使用未来的 css 语法
4. postcss-sprites 图片合并成一张图

```js
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader' // css 处理 , autoprefixer: 加前缀
          }
        ]
      },
```

- postcss.config.js

```js
module.exports = {
  plugins: [
    require('autoprefixer'), /* 加 css 各浏览器前缀 */
    require('cssnano'), /* 优化 & 压缩 css */
    require('postcss-cssnext'),   /* 使用未来的 css 语法 */
    require('postcss-sprites')({   /* 图片合并成一张图 */
      spritePath: 'dist/assets/imgs/sprites', /* 输出路径 */
      retina: true   /* 处理苹果 retina 屏幕 */
    })
  ]
}
```

## 处理图片

- file-loader

```js
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader', // 把文件挪动到打包目录下，文件地址返回给变量
```

- url-loader

```js
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader', // 将图片转换为 base64
            options: {
              name: '[name]-[hash:5].[ext]', // 生成的图片名称
              limit: 2048, // 超出 2048 处理成 base64
              publicPath: '', // 引入资源路径前面加的前缀 ''
              outputPath: 'dist/', // 放置在 dist 文件夹下
              useRelativePath: true // 放置在 assets/imgs, 因为图片原本路径为 (aseets/imgs)
            }
          }
        ]
      },
```

- img-loader

```js
         {
            loader: 'img-loader', /* 压缩图片 */
            options: {
              pngquant: { /* .png 图片处理 */
                quality: 80 /* 压缩 png */
              }
            }
          }
```

## 处理字体

```js
      {
        test: /\.(eot|woff2?|ttf|svg)$/, /* 字体文件 */
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].[ext]',
              limit: 5000, /* 超出 5000 处理成 base64 */
              outputPath: 'assets/imgs/'
            }
          }
        ]
      },
```

## ESlint

- 结合 happypack & babel & eslint

```js
const Happypack = require('happypack')
  module: {
    noParse: /jquery/, // 不需要解析
    rules: [ // 后往前 右往左 执行
      {
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules',
      },
    new Happypack({ // js 用 Happypack 打包
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { 'legacy' : true }], // 类和对象装饰器
            ]
          }
        },
        {
          loader: 'eslint-loader', // 放置 babel-loader 后           options: {
            formatter: require('eslint-friendly-formatter') // 报错时输入内容的格式更友好
          },
          enforce: 'pre' // pre 先执行 , post 后执行
        }
      ]
    }),
```

## 处理第三方库

- 解析第三方包

```js
  resolve: { // 解析第三方包
    modules: [path.resolve('node_modules')], // 找文件的位置
    mainFields: ['style' , 'main'], // **package.json** 先找 style 再找 main
    mainFiles: [], // 入口文件名字 index.js
    extensions: [ 'js' , 'css' , 'json'], // 引入文件的后缀依次解析
    alias: { // 别名
      bootstrap: 'bootstrap/dist/css/bootstrap.css'
    }
  },
**index.js**
import 'bootstrap'
```

- imports-loader 导入加载程序允许您使用依赖于特定全局变量的模块

```js
      {
        test: path.resolve(__dirname, 'src/app.js'),
        use: [
          {
            loader: 'imports-loader',
            options: {
              $: 'jquery'
            }
          }
        ]
      },
```

- 暴露全局的 loader

```js
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$' // 暴露全局的 loader
      },
import $ from 'jquery'
console.log(window.$)
```

- 在每个模块中都注入 $

```js
const webpack = require ('webpack')
    new webpack.ProvidePlugin({ // 在每个模块中都注入 $
      $: 'jquery'
    }),
**index.js**
console.log($)
```

- externals CDN 方式

```js
// 如 CDN 引入的 jquery ， require 引入但不希望 webpack 将其编译进文件中
  externals: {
    jquery: '$'
  },
import $ from 'jquery'
console.log($)
```

## source map

```js
// 生产选择, 不会产生列，是一个单独的映射文件
devtool: 'cheap-module-source-map',
```

```js
// 开发选择, 不会产生文件和列，集成在在打包后的文件中
devtool: 'cheap-module—eval-source-map',
```

## watch

- 文件被更新，代码将被重新编译

```js
  watch: true, // 实时监控打包
  watchOptions: {
    poll: 1000, // 监听间隔
    aggregateTimeout: 500, // 防抖
    ignored: /node_modules/ // 不需要监控
  },
```

## devServer

- 提供一个 web 服务器，能实时重新加载刷新浏览器

```js
  devServer: { // 开发服务器配置
    port: 8080, // 启动端口
    inline: false, // 构建消息将会出现在浏览器控制台
    progress: true, // 运行过程
    hot: true, // 启动热更新
    hotOnly: true, // 启用热模块替换，在构建失败时不刷新页面作为回退
    open: true, // 告诉 dev-server 在 server 启动后打开浏览器
    openPage: '', // 指定打开浏览器时的导航页面
    https: true, // 默认情况下，dev-server 通过 HTTP 提供服务 使用自签名证书
    overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    lazy: true, // 在请求时才编译包 webpack 不会监视任何文件改动
    compress: true, // 压缩
    contentBase: './build', // 指向 ./build 文件作为静态服务
    historyApiFallback: { // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'], // 指定文件类型, 匹配了才重定向
      rewrites: [ // 重定向规则
        {
          from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
          to: function(context) {
            return '/' + context.match[1] + context.match[2] + '.html'
          }
        }
      ]
    },
    // proxy: {
    //   '/api': 'http://localhost:3000' // 1) 配置代理
    //   '/api': { // 2
    //     target: 'http://localhost:3000', // 配置代理
    //     pathRewrite: {'/api':''} // 重写路径
    //   }
    // }
    proxy: { // 重写方式把请求代理到 express 服务上
      '/': {
        target: 'https://m.weibo.cn', // 请求远端服务器
        changeOrigin: true, // 默认情况下代理时保留主机头的原点，您可以将 changeOrigin 设置为 true 以覆盖此行为
        headers: { // http 请求头
          Cookie: 'M_WEIBOCN_PARAMS=luicode%3D20000174%26lfid%3D102803_ctg1_7978_-_ctg1_7978%26uicode%3D20000174%26fid%3D102803_ctg1_7978_-_ctg1_7978; expires=Sun, 25-Nov-2018 16:18:59 GMT; Max-Age=600; path=/; domain=.weibo.cn; HttpOnly'
        },
        logLevel: 'debug', // 控制台显示代理信息
        pathRewrite: { // 重定向接口请求
          '^/container': '/api/container'
        }
      }
    },
    before(app) { // 提供的钩子，前端模拟数据
      app.get('/user', (req, res) => {
        res.json({ name: 'ganbefore' })
      })
    }
    // 3) 服务端启动 webpack
  },
```

## 每次打包都会删掉原来的并重新打包

```js
const CleanWebpackPlugin = require('clean-webpack-plugin') // 每次打包都会删掉原来的并重新打包

    new CleanWebpackPlugin(),
```

## 拷贝文件

```js
const CopyWebpackPlugin = require('copy-webpack-plugin') // 拷贝文件

    new CopyWebpackPlugin([
      {
        from: './doc',
        to: './'
      }
    ]),
```

## 版权信息

```js
const webpack = require('webpack')

    new webpack.BannerPlugin('ganyihuan 2019'), // 版权信息
```

## 定义环境变量

```js
const webpack = require('webpack')

    new webpack.DefinePlugin({ // 定义环境变量
      DEV: JSON.stringify('production'), // string production
      FLAG: 'true', // boolean
      EXPRESSION: '1+1' // 2
    }),
```

## 打包分析

- analyse 社区方式

```js
const BundleAnalzyerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin // 打包分析

    new BundleAnalzyerPlugin(),
```

```node
webpack-bundle-anlayzer stats.json
```

- analyse 官网方式

[打包分析](http://webpack.github.io/analyse/)

Mac:
webpack --profile --json > stats.json

Window:
webpack --profile --json | Out-file 'stats.json' -Encoding OEM

## 优化打包速度

- 动态链接库

```js
    new webpack.DllPlugin({ // 某种方法实现了拆分 bundles
      name: '_dll_[name]', // 暴露出的 Dll 的函数名
      path: path.resolve(__dirname, 'build', 'manifest.json')
    })
```

```js
    new webpack.DllReferencePlugin({ // 引入 DllPlugin 打包出来的资源
      manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    }),
```

- library

```js
  output: { // 出口
    library: 'MyLibrary', // 暴露 library, 将你的 bundle 暴露为名为全局变量，通过此名称来 import
    libraryTarget: 'umd' // 控制以不同形式暴露 (umd: 在 AMD 或 CommonJS require 之后可访问)
  },
```

- 关闭 sourceMap 能优化打包速度
- 减少 babel-loader include 范围能优化打包速度

```js
{
  test: /\.js$/,
  loader: 'babel-loader',
  include: [
    resolve('src')
  ]
},
```

- 忽略某些包

```js
  externals: [ 'lodash' ], // 打包时忽略 lodash

    new webpack.IgnorePlugin(/\.\/locale/, /moment/), // 忽略 moment 里的 locale 包

      {
        include: path.resolve(__dirname, 'src'),
        exclude: '/node_modules'
      },

  module: { // 模块 , css, img... 转换为模块
    noParse: /jquery/, // 不需要解析
```

## 长缓存优化

```js
    new webpack.NamedModulesPlugin(), // module 的版本号从数字改成相对路径 有利于长缓存优化
    new webpack.NamedChunksPlugin() // chunk 的版本号从数字改成文件名字
```

## 开发环境 & 生产环境

```js
const merge = require('webpack-merge')
const devConfig = require('./webpack.dev.js')
const prodConfig = require('./webpack.prod.js')
const commonConfig = {
}
module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devdConfig)
  }
}
```

- package.json

```json
  "scripts": {
    "dev-build": "webpack --config ./build/webpack.common.js",
    "dev": "webpack-dev-server --config ./build/webpack.common.js",
    "build": "webpack --env.production --config ./build/webpack.common.js"
  },
```