const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const assets = require('postcss-assets');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

var config = {
    entry: [
        './entry.js'
    ],

    output: {
        path: __dirname,
        filename: './bundle.js'
    },

    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css?importLoaders=1!postcss' },
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            }
        ]
    },

    plugins: [
        new ProgressBarPlugin(),
        new WebpackNotifierPlugin({ alwaysNotify: true }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('development') }
        }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.optimize.OccurrenceOrderPlugin()
        // ,
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
};


module.exports = config;