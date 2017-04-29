var autoprefixer = require('autoprefixer'),
    classPrefix = require('postcss-class-prefix'),
    webpack = require('webpack'),
    pkg = require('../package.json'),
    path = require('path');

process.traceDeprecation = true; 

var nodeModDir = path.resolve('./node_modules/') + '/',
    banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage;

var postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins:  [classPrefix('eruda-'), autoprefixer]
    }
};   

module.exports = {
    devtool: false,
    entry: './src/index.es6',
    devServer: {
        contentBase: './test',
        port: 3000
    },
    output: {
        path: path.resolve(__dirname, '../'),
        publicPath: "/assets/",
        filename: 'eruda.js',
        library: ['eruda'],
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.es6$/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.scss$/,
                loaders: ['css-loader', postcssLoader, 'sass-loader']
            },
            {
                test: /\.css$/,
                loaders: ['css-loader', postcssLoader]
            },
            // https://github.com/wycats/handlebars.js/issues/1134
            {
                test: /\.hbs$/,
                loader: nodeModDir + 'handlebars-loader/index.js',
                options: {
                    runtime: nodeModDir + 'handlebars/dist/handlebars.runtime.js',
                    helperDirs:path.resolve(__dirname, '../','src/lib/hbsHelper')
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(gif|jpg|png|woff|woff2|svg|eot|ttf)\??.*$/, 
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};