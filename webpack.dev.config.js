const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	entry: './src/SummerTest.js',
	output: {
		filename: './summer-ci.js'
	},
	mode: 'development', // production,development,none
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		port: 7000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'summer-ci实例',
			// Load a custom template (lodash by default)
			template: './public/index.html',
			filename: './index.html',
		})
	]
}
