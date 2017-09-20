var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var config = require('./webpack.base.config');


var plugins = [
    //js压缩
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
            warnings: false
        },
    }),
    // //css压缩
    // new webpack.LoaderOptionsPlugin({
    //     minimize: true,
    // })
    // css压缩
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {discardComments: {removeAll: true}},
        canPrint: true
    }),
    new HtmlWebpackPlugin({
        template: './app/index.html',
        debug: false,
        excludeChunks: ['js/index'],
    }),

]

plugins.forEach(i => config.plugins.push(i));


module.exports = config;