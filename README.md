# webpack4

## 内容大纲

![内容大纲](https://i.loli.net/2019/04/16/5cb5c93e8f9e2.jpeg)

## 基本概念

- entry: 某段代码入口 , 打包入口
- output: 输出
- loaders: 文件转化为模块
- plugins: 参与打包过程
- chunk: 代码块
- bundle: 打包生成的文件
- module: 模块, css, img 转换为模块
- 打包: webpack --config webpack-config.js

## placeholders

1. [ext] 目标文件 / 资源的文件扩展名
2. [name] 文件 / 资源的基本名称
3. [hash] 指定生成文件内容哈希值的哈希方法。

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

````node
cd project file
yarn init -y
yarn add webpack webpack-cli -D
npx webpack
npx webpack --config webpack.config.my.js // 运行自定义名称配置文件 ```
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

- 混合第三方模块提取

```js
  entry: {
    app : './src/app.js' ,
    vendor: [ 'lodash' ]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      /* 需要提取的公共代码出现的次数 , Infinity 不会将任何模块打包进去 ( 区分开提取 ) */
      minChunks: Infinity ,
    }
  },
```

- 区分开第三方模块提取

```js
  entry: {
    app: './src/app.js',
    vendor: ['lodash']
  },
  optimization: {
    splitChunks: {
      name: 'manifest', // 第三方模块与代码区分开提取 , 有利于长缓存优化 ( 区分开提取 )
      minChunks: Infinity, // 需要提取的公共代码出现的次数 , Infinity 不会将任何模块打包进去 ( 区分开提取 )
    }
  },
```

## optimization

```js
  optimization: { // 优化项
    usedExports: true, // 那些模块导出的模块被使用了才打包
    runtimeChunk: { // manifest 抽离放入 runtime 文件中
      name: 'runtime'
    },
```

## Tree-shaking

- js, css 压缩

```js
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
```

- html 压缩

```js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 简化 HTML 文件的创建 , 即使 css, js 文件名称变化 , 能自动加载配对的 css, js 文件
    new HtmlWebpackPlugin({
      template: './src/index.html' , // 模板
      filename: 'index.html' , // 打包后的文件名
      minify: { // 压缩 html
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
