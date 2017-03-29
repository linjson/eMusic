var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

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
        //js压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         warnings: false
        //     },
        // }),
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
        new CopyWebpackPlugin([
            {from: path.resolve('./app/index.html'), to: 'index.html'},
        ]),
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
    ],
    devtool: 'source-map',
    devServer: {
        // contentBase:'/app/',
        port: 7777,
        host: 'localhost',
        historyApiFallback: true,
    },

    module: {

        loaders: [
            //需要在js上加上require("expose-loader?!jquery");才是真正的全局变量window.jQuery
            {test: require.resolve('jquery'), loader: 'expose-loader?jQuery'},
            // {test: require.resolve('react'), loader: 'expose-loader?React'},
            // {test: require.resolve('react-dom'), loader: 'expose-loader?ReactDOM'},
            {
                test: /\.(js|jsx)$/,
                loaders: ['react-hot-loader', 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0'],
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss)$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'}),
            },
            {
                test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2|woff)$/i,
                exclude: /^node_modules$/,
                loader: ['url-loader?limit=5000&name=img/[hash:8].[name].[ext]']
            },
        ],

    },
};