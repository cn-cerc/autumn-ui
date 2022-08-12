const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        common: './src/webpack/common.ts',
        mc: './src/webpack/mc.ts',
        mcEcharts: './src/webpack/mc-echarts.ts',
        export: './src/webpack/export.ts',
    },
    output: {
        filename: './aui-[name].js',
		library: ['aui', '[name]'],
        libraryExport: 'default',
        libraryTarget: 'window' //导出到浏览器的 window 对象中
    },
    mode: 'development', // production,development,none
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        port: 81,
        host: 'debug.4plc.cn'
    },
    // 	devtool 取值
    // 1 source-map ：
    // 产生一个单独的source-map文件，功能最完全，但会减慢打包速度
    // 2 eval-source-map ：
    // 使用eval打包源文件模块，直接在源文件中写入干净完整的source-map，不影响构建速度，但影响执行速度和安全，建议开发环境中使用，生产阶段不要使用
    // 3 hidden-source-map：
    // 不会产生单独的map文件，（与eval-source-map类似）但开发者工具就只能看到行，但无法对应到具体的列（符号），对调试不便
    devtool: 'eval-source-map',
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
                test: /\.(jpg|png|gif)$/,
                generator: {
                    filename: 'imgs/[name][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|ttf)$/,
                generator: {
                    filename: 'iconfont/[name][ext][query]'
                }
            }
        ]
    },
    resolve: { // new add +
        extensions: ['.tsx', '.ts', '.js']
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // 是否将注释剥离到单独的文件中，默认开启
                extractComments: false,
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            lod: 'lodash'
        })
    ]
}
