var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var config = require('config');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/client/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    devtool: 'source-map',
    entry:[
        './client/render.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: "index_bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015'}
        ]
    },
    plugins: [HTMLWebpackPluginConfig, new webpack.optimize.UglifyJsPlugin({minimize: true})]
}