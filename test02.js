/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-26 18:22:37
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-27 10:48:05
 */
const path = require('path')

module.exports = {
	mode: 'production',
	entry: {
		index: './src/index.js'
	},
	output: {
		filename: '[name].[hash:5].js',
		chunkFilename: '[name].[contenthash].js',
		publicPath: '',
		path: path.resolve(__dirname, 'dist'),
		library: 'MyLibrary',
		libraryTarget: 'umd'
	},
	optimization: {
		runtimeChunk: {
			name: 'runtime'
		},
		usedExports: true,
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				vendors: {
					priority: 1,
					filename: 'vendors.js',
					chunks: 'initial',
					minSize: 0,
					minChunks: 2,
					test: /[\\/]node_modules[\\/]/
				},
				default: {
					priority: -1,
					filename: 'common.js',
					chunks: 'initial',
					minSize: 0,
					minChunks: 2,
					reuseExistingChunk: true
				}
			}
		}
	},
	watch: true,
	watchOptions: {
		poll: 1000,
		aggregateTimeout: 500,
		ignored: /node_modules/
	},
	resolve: {
		modules: [path.resolve('node_modules')],
		extensions: ['.js'],
		mainFields: ['style'],
		alias: {
			bootstrap: ''
		}
	},
	devtool: 'cheap-module-source-map',
	externals: {
		jquery: '$'
	},
	module: {
		noParse: /jquery/
	}
}
