const webpack = require('webpack')
const path = require('path')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const Happypack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		index: ''
	},
	output: {
		filename: '[name].[hash:5].js',
		chunkFilename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		pathPublic: '',
		library: '',
		libraryTarget: 'umd'
	},
	optimization: {
		runtimeChunk: {
			name: 'runtime'
		},
		usedExports: true,
		minimizer: [
			new UglifyjsWebpackPlugin({
				sourceMap: true,
				cache: true,
				parallel: true
			}),
			new OptimizeCssAssetsWebpackPlugin({})
		],
		splitChunks: {
			chunks: 'all',
			minSize: 3000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitalRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				vendors: {
					priority: 1,
					test: /[\\/]node_modules[\\/]/,
					filename: 'vendors.js',
					minSize: 0,
					minChunks: 2
				},
				default: {
					priority: -1,
					chunks: 'initial',
					filename: 'common.js',
					minSize: 0,
					minChunks: 2,
					reuseExistingChunk: true
				}
			}
		}
	},
	watch: true,
	watchOptions: {
		poll: 3000,
		aggregateTimeout: 500,
		ignored: /node_modules/
	},
	resolve: {
		modules: [path.resolve('node_modules')],
		extensions: ['.js'],
		mainFilelds: ['style'],
		alias: {
			bootstrap: ''
		}
	},
	devtool: 'cheap-module-source-map',
	externals: {
		jquery: '$'
	},
	devServer: {
		port: 8080,
		inline: false,
		comporess: true,
		progress: true,
		hot: true,
		hotOnly: true,
		open: true,
		openPage: '',
		https: true,
		overlay: true,
		lazy: true,
		contentBase: './build',
		historyApiFallback: {
			htmlAcceptHeaders: ['text/html'],
			rewrites: [
				{
					from: /\.*/,
					to: '/index.html'
				}
			]
		},
		proxy: {
			'': {
				target: '',
				changeOrigin: true,
				headers: {
					Cookie: ''
				},
				logLevel: 'debug',
				pathRewrite: {
					'': ''
				}
			}
		},
		before(app) {
			app.get('/user', (req, res) => {
				res.json({ name: '' })
			})
		}
	},
	modules: {
		noParse: /jquery/,
		rules: [
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$'
      },
      {
        test: /\.js$/,
        use: 'Happypack/loader?id=js',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
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
					{
						loader: 'style-loader',
						optioins: {
							sourceMap: true,
							singleton: true,
							modules: true,
							insertAt: 'top',
							insertInto: '#app',
							transform: ''
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 2
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							limit: 2048,
							publicPath: '',
							outputPath: 'dist/',
							useRelativepath: true
						}
					}
				]
			},
			{
				test: /\.(eot|woff2?|ttf|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[hash:5].[ext]',
							limit: 5000,
							outputPath: ''
						}
					},
					{
						loader: 'img-loader',
						options: {
							pngquant: {
								quality: 80
							}
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'img-withimg-loader'
					}
				]
			}
		]
	},
	plugins: [
		new WebpackBundleAnalyzer(),
		new HtmlWebpackPlugin({
			template: '',
			filename: '',
			minify: {
				removeAttribute: true,
				collapseWhitespace: true
			},
			hash: true
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: '',
				to: ''
			}
		]),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NamedChunksPlugin(),
		new webpack.BannnerPlugin(),
		new webpack.DefinePlugin({
			FLAG: 'true'
		}),
		new webpack.IgnorePlugin(/\.\/locale/, /moment/),
		new webpack.ProvidePlugin({
			$: 'jquery'
		})
		new Happypack({
			id: 'js',
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: [],
						plugins: []
					}
				},
				{
					loader: 'imports-loader?this=>window'
				},
				{
					loader: 'eslint-loader',
					options: {
						formatter: require('eslint-friendly-formatter')
					},
					enforce: 'pre'
				}
			]
		})
	]
}
