module.exports = {
	module: {
		noParse: /jquery/,
		rules: [
			{
				test: require.resolve(__dirname, 'jquery'),
				use: [
					{
						loader: 'expose-loader?$'
					}
				]
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: 'Happypack/loader?id=js',
						include: path.resolve(__dirname, 'src'),
						exclude: /node_modules/
					}
				]
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
						options: {
							sourceMap: true,
							singleton: true,
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
				test: /\.(png|jpg|jpeg|giff)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name]-[hash:5].[ext]',
							limit: 2048,
							publicPath: '',
							outputPath: '',
							useRelativePath: true
						}
					}
				]
			},
			{
				test: /\.(eot|woff2?|ttf|svg)$/,
				use: [
					{
						loader: 'url-loader',
						optiosn: {
							name: '[name]-[hash:5].[ext]',
							limit: 5000,
							outputPath: ''
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-withimg-loader'
					}
				]
			}
		]
	},
	plugins: [
		new Happypack({
			id: 'js',
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env', { useBuiltIns: 'usage' }]
						],
						plugins: [
							[]
						]
					}
				},
				{
					loader: 'improts-loader?this=>window'
				}
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
