/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-26 18:22:37
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-31 16:51:40
 */
module.exports = {
	mode: 'production',
	entry: {
		index: './src/index.js'
	},
	output: {
		filename: '[name].[hash:5].js', // 处理后生成文件名称
		chunkFilename: '[name].[contenthash].js', // 未列在 entry, 又需要被打包出来的文件命名
		publicPath: '', // 打包后文件名前面加前缀
		path: path.resolve(__dirname, 'dist'), // 打包后文件放哪里 (path.resolve 相对路径解析成绝对路径)
		library: 'MyLibrary', // 暴露 library
		libraryTarget: 'umd' // 控制以不同形式暴露
	},
	optimization: {
		runtimeChunk: { // manifest 提取放入 runtime 文件中
			name: 'runtime'
		},
		usedExports: true, // import 的模块被使用了才打包
		splitChunks: { // 多页面分割代码
			chunks: 'all', // 选择哪些块
			minSize: 30000, // 大于才分割
			minChunks: 1, // 模块被使用了 1 次后进行代码分割
			maxAsyncRequests: 5, // 限制异步模块并行请求数
			maxInitialRequests: 3, // 限制入口的拆分数量
			automaticNameDelimiter: '~', // 分割生成的文件之间的连接符
			name: true, // 分割块的名称
			cacheGroups: {
				vendors: {
					priority: 1, // 优先级
					filename: 'vendors.js',
					chunks: 'initial',
					minSize: 0,
					minChunks: 2,
					test: /[\\/]node_modules[\\/]/ // 是否来自 node_modules
				},
				default: {
					priority: -1,
					filename: 'common.js',
					chunks: 'initial',
					minSize: 0,
					minChunks: 2,
					reuseExistingChunk: true // 模块被打包，忽略模块
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
	resolve: {
		modules: [path.resolve('node_modules')], // 解析模块时应该搜索的目录。
		extensions: ['.js'], // 自动解析的扩展
    mainFields: ['style'], // 从 npm 中导入模块时, 在 package.json 中使用哪个字段导入模块
    mainFiles: ['index'], // 解析目录时要使用的文件名
		alias: { // 创建 import 或 require 的别名
			bootstrap: ''
		}
	},
	devtool: 'cheap-module-source-map', // 追踪错误和警告
	externals: { // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
		jquery: '$'
	},
	module: {
		noParse: /jquery/ // 防止 webpack 解析该文件
	}
}
