module.exports = {
	devServer: {
		port: 8080,
		lazy: true,
		https: true,
		compress: true,
		progress: true,
		inline: false,
		overlay: true,
		hot: true,
		hotOnly: true,
		open: true,
		openPage: '',
		contentBase: './build',
		historyApiFallback: {
			rewrite: [
				{
					from: '',
					to: ''
				}
			]
		},
		proxy: {
			'/react/api': {
				target: '',
				headers: {
					Cookie: ''
				},
				changeOrigin: true,
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
	}
}
