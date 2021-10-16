const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: './src/SummerTest.ts',
	output: {
		filename: './sci.js'
	},
	mode: 'development', // production,development,none
	devServer: {
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		port: 7000,
	},
	devtool: 'inline-source-map',
	module: {   // new add +
		rules: [{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/
		}]
	},
	resolve: { // new add +
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'summer-ci实例',
			// Load a custom template (lodash by default)
			template: './public/index.html',
			filename: './index.html',
		}),
		// new webpack.HashedModuleIdsPlugin(),
		new webpack.ProvidePlugin({
			lod: 'lodash'
		})
	]
}
