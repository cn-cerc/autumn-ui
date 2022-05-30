const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/fpl.ts',
	output: {
		filename: './diteng-aui.js',
		library: 'aui',
		libraryExport: 'default',
		libraryTarget: 'window' //导出到浏览器的 window 对象中
	},
	mode: 'production', // production,development,none
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		port: 80,
	},
	// 	devtool 取值
	// 1 source-map ：
	// 产生一个单独的source-map文件，功能最完全，但会减慢打包速度
	// 2 eval-source-map ：
	// 使用eval打包源文件模块，直接在源文件中写入干净完整的source-map，不影响构建速度，但影响执行速度和安全，建议开发环境中使用，生产阶段不要使用
	// 3 hidden-source-map：
	// 不会产生单独的map文件，（与eval-source-map类似）但开发者工具就只能看到行，但无法对应到具体的列（符号），对调试不便
	devtool: 'hidden-source-map',
	module: {   // new add +
		rules: [
			{ test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
			{
				include: [path.resolve(__dirname, "node_modules")],
				test: /\.css$/, use: [
					'style-loader',
					{
						loader: 'css-loader',
					}
				]
			},
			{
				include: [path.resolve(__dirname, "src")],
				test: /\.css$/, use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[path][name]__[local]--[hash:base64:5]',
								exportLocalsConvention: "camelCase",
							}
						}
					}
				]
			},
			{
				include: [path.resolve(__dirname, "../diteng")],
				test: /\.css?$/, use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[name]__--[hash:base64:5]',
								exportLocalsConvention: "camelCase",
							}
						}
					}
				]
			}
		]
	},
	resolve: { // new add +
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@diteng': path.join(__dirname, '../diteng/src')
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'autumn-ui 实例',
			// Load a custom template (lodash by default)
			template: './public/index.html',
			filename: './fpl-aui.html',
		}),
		// new webpack.HashedModuleIdsPlugin(),
		new webpack.ProvidePlugin({
			lod: 'lodash'
		})
	]
}
