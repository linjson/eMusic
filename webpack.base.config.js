var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
// var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    target: 'electron',
    entry: {
        "js/index": './app/js/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/vendor-manifest.json'),
            extensions: [".js", ".jsx"]
        }),
    ],

    module: {

        loaders: [
            //需要在js上加上require("expose-loader?!jquery");才是真正的全局变量window.jQuery
            // {test: require.resolve('jquery'), loader: 'expose-loader?jQuery'},
            // {test: require.resolve('react'), loader: 'expose-loader?React'},
            // {test: require.resolve('react-dom'), loader: 'expose-loader?ReactDOM'},
            {
                test: /\.(js|jsx)$/,
                loaders: ['react-hot-loader', 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0,plugins[]=transform-runtime'],
                exclude: /node_modules/,
            },
            {
                test: /\.(css)$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1!postcss-loader',
                    publicPath: '../'
                }),
            },
            {
                test: /\.(scss)$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1!postcss-loader!sass-loader',
                    publicPath: '../'
                }),
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2|woff)$/i,
                exclude: /^node_modules$/,
                loader: ['url-loader?limit=5000&name=img/[name].[ext]']
            },
        ],
    },
};