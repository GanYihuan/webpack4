const webpack = require('webpack')
const WebpackBundleAnalyzerPlugin = require('webpack.bundle.analyzer').WebpackBundleAnalyzerPlugin
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const Happypack = require('happypack')

module.exports = {
	optimization: {
		minimizer: [
			new OptimizeCssAssetsWebpackPlugin(),
			new UglifyjsWebpackPlugin({
				sourceMap: true,
				cache: true,
				parallel: true
			})
		]
	},
	modules: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader
				]
			}
		]
	},
	plugins: [
		new WebpackBundleAnalyzerPlugin(),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin(
			[
				{
					from: '',
					to: ''
				}
			]
		),
		new HtmlWebpackPlugin({
			template: '',
			filename: 'index.html',
			minify: {
				remoteAttributeQuotes: true,
				collapseWhitespace: true
			},
			hash: true
		}),
		new MiniCssExtractPlugin({
			filename: 'css/main.css',
			chunkFilename: '[name].chunk.css'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NameModulesPlugin(),
		new webpack.NameChunksPlugin(),
		new webpack.BannerPlugin(),
		new webpack.DefinePlugin({
			FLAG: 'true'
		}),
		new webpack.IgnorePlugin(/\\.locale/,/menent/),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
	]
}
