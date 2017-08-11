const path = require('path');
const webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        vendor: ['react', 'react-dom','material-ui','react-tap-event-plugin','redux','redux-persist','redux-thunk','react-redux','react-virtualized','lodash','react-router','react-router-redux','react-router-dom','history','react-motion','react-resizable-box', 'react-material-ripple'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]_library'
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),

        new webpack.DllPlugin({
            /**
             * path
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.join(__dirname, 'dist', '[name]-manifest.json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。
             */
            name: '[name]_library'
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        // }),
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true,
        // }),
    ],
    module: {

        loaders: [
            {
                test: /\.(css)$/,
                exclude: /^node_modules$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1!postcss-loader',
                    publicPath: '../'
                }),
            },
        ],
    },
};