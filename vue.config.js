const path = require('path')

module.exports = {
	// 选项...
	publicPath: '/',

	// 配置项不懂的地方，请查看 Vue CLI 官方文档 https://cli.vuejs.org/zh/config/#devserver
	devServer: {
		disableHostCheck: true,
		host: '0.0.0.0',
		port: 8081 //  本地开发环境 - 前端工程启动的端口；如果不想指定端口，期望启动追加，请注释 port 属性
	},

	productionSourceMap: false,

	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'stylus',
			patterns: []
		}
	},

	configureWebpack: (config) => {
		//  引入uglifyjs-webpack-plugin
		let UglifyPlugin = require('uglifyjs-webpack-plugin')
		if (process.env.NODE_ENV == 'production') {
			config.mode = 'production'
			let optimization = {
				minimizer: [
					new UglifyPlugin({
						uglifyOptions: {
							warnings: false,
							compress: {
								drop_console: true,
								drop_debugger: false,
								pure_funcs: ['console.log']
							}
						}
					})
				]
			}
			Object.assign(config, {
				optimization
			})
		} else {
			config.mode = 'development'
		}
		config.resolve.alias = {
			'@': path.resolve(__dirname, './src'),
			_v: path.resolve(__dirname, './src/views'),
			_c: path.resolve(__dirname, './src/components'),
			_a: path.resolve(__dirname, './src/assets'),
			_r: path.resolve(__dirname, './src/request'),
			_public: path.resolve(__dirname, './public')
		}
	}
}
