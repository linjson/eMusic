var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
// var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var config = require('./webpack.base.config');


var plugins = [
    ////js压缩
    // new webpack.optimize.UglifyJsPlugin({
    //     sourceMap: true,
    //     compress: {
    //         warnings: false
    //     },
    // }),
    // //css压缩
    // new webpack.LoaderOptionsPlugin({
    //     minimize: true,
    // })
    //css压缩
    // new OptimizeCssAssetsPlugin({
    //     assetNameRegExp: /\.css$/g,
    //     cssProcessor: require('cssnano'),
    //     cssProcessorOptions: { discardComments: {removeAll: true } },
    //     canPrint: true
    // }),
    new HtmlWebpackPlugin({
        template: './app/index.html',
        server: 'http://localhost:7777/dist/',
        debug: true,
        excludeChunks: ['js/index'],
    }),

]

plugins.forEach(i => config.plugins.push(i));


config.devtool = 'source-map';
config.devServer = {
    // contentBase:'/app/',
    port: 7777,
    host: 'localhost',
    historyApiFallback: true,
}

module.exports = config;