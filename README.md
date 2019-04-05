# webpack4

## 知识点

1. 编译 ES6/ES7

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

## 内容大纲

![内容大纲](https://i.loli.net/2019/04/05/5ca6425c16974.jpeg)
