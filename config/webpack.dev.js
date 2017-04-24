const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const helpers = require('./helpers');

const ENV = process.env.ENV = 'development';

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: process.env.ENV === "development"
});

module.exports = {

    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8081/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        'vendor': './client/src/vendor.js',
        'app': './client/src/root.js'
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(pug|jade)$/,
                loader: 'pug-html-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            }
        ]
    },

    plugins: [
        extractSass,
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
            }
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'client/src/index.html',
            title: 'Medimizer Dashboard'
        })
        // new HtmlWebpackPlugin({
        //     inject: 'body',
        //     template: '!!pug-loader!server/views/index.pug',
        //     title: 'React Dev Server'
        // })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
};


