# webpack4

## 编译 ES6/ES7

- babel-loader
  这个包允许使用 babel 和 webpack 编译 JavaScript 文件
- babel-core
  编译器核心
- babel-preset-env
  将 ES6 的代码转成 ES5
  env 包含所有规范 , es2015, es2016, es2017
  针对语法
- babel-preset
  规范的总结
  针对语法
- babel-polyfill
  全局垫片污染全局 , 能写 es7/ 8 新方法 , 适合开发应用使用
  引用 `import babel-polyfill`
  针对方法
- babel-plugin-transform-runtime
  局部垫片不会污染全局 , 能写 es7/ 8 新方法 , 适合在开发组件类库中使用 .babelrc 文件中配置
  针对方法
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

- @babel/plugin-proposal-decorators
  将类和对象装饰器编译到 ES5
- @babel/plugin-proposal-class-properties
  这个插件转换静态类属性以及用属性初始化器语法声明的属性

## 提取公共代码

webpack4 删除了 webpack.optimize.CommonsChunkPlugin

```node
npm i webpack -D
npm i lodash -S  // 用来提取的第三方代码
```

```js
  optimization: { // 优化项
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
```

- 混合第三方模块提取

```js
  entry: {
    app : './src/app.js' ,
    vendor: [ 'lodash' ]
  },
  optimization: {
    /* 适用于多 entry 情况 */
    splitChunks: {
      /* 混合第三方模块提取 */
      name: 'vendor',
      /* 需要提取的公共代码出现的次数 , Infinity 不会将任何模块打包进去 ( 区分开提取 ) */
      minChunks: Infinity ,
    }
  },
```

- 区分开第三方模块提取

```js
  entry: {
    app : './src/app.js' ,
    vendor: [ 'lodash' ]
  },
  optimization: {
    /* 适用于多 entry 情况 */
    splitChunks: {
      /* 第三方模块与代码区分开提取 , 有利于长缓存优化 ( 区分开提取 ) */
      name: 'manifest' ,
      /* 需要提取的公共代码出现的次数 , Infinity 不会将任何模块打包进去 ( 区分开提取 ) */
      minChunks: Infinity ,
    }
  },
```

## 代码分割和懒加载

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

/* 动态加载模块 , 懒加载 */

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
  /* 动态 import 会马上执行代码 */

  import(/* webpackChunkName: 'subpageA */ './subPageA').then(function(
    subPageA
  ) {
    console.log(subPageA)
  })
} else if (page === 'subPageB') {
  import('./subPageB').then(function(subPageA) {
    console.log(subPageA)
  })
}
```

## 内容大纲

![内容大纲](https://i.loli.net/2019/04/05/5ca6425c16974.jpeg)
