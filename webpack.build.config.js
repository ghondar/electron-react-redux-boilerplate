const webpack       = require('webpack'),
  path              = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  CleanPlugin       = require('clean-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  BabiliPlugin      = require('babili-webpack-plugin')

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src')
const OUTPUT_DIR = path.resolve(__dirname, 'dist')
const OUTPUT_PACKAGE = path.resolve(__dirname, 'builds')

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [ SRC_DIR ]

module.exports = {
  bail   : true,
  devtool: 'source-map',
  entry  : [ 'babel-polyfill', SRC_DIR + '/App.jsx' ],
  output : {
    // filename: 'bundle.js',
    publicPath   : './',
    filename     : 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    path         : OUTPUT_DIR
  },
  module: {
    loaders: [
      {
        test   : /\.json$/,
        loader : 'json',
        include: defaultInclude
      },
      {
        test   : /\.jsx?$/,
        loader : [ 'babel-loader' ],
        exclude: /(node_modules)/,
        include: defaultInclude
      },
      {
        test   : /\.js$/,
        loaders: [ 'babel-loader' ],
        exclude: /(node_modules)/,
        include: defaultInclude
      },
      {
        test: /\.styl/,
        use : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use     : [
            {
              loader : 'css-loader',
              options: {
                modules       : true,
                importLoaders : 1,
                localIdentName: '__[hash:base64:10]'
              }
            },
            'stylus-loader'
          ]
        }),
        include: defaultInclude
      }, {
        test: /\.css$/,
        use : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use     : [
            {
              loader : 'postcss-loader',
              options: {
                modules       : true,
                importLoaders : 1,
                localIdentName: '__[hash:base64:10]'
              }
            }
          ]
        }),
        include: defaultInclude
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ],
    extensions: [ '.js', '.json', '.jsx' ]
  },
  target : 'electron-renderer',
  plugins: [
    new CleanPlugin([ OUTPUT_DIR, OUTPUT_PACKAGE ]),
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      __CLIENT__     : true,
      __SERVER__     : false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__   : false,
      __DEV__        : false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')   // Useful to reduce the size of client-side libraries, e.g. react
      }
    }),
    new ExtractTextPlugin({
      filename : 'static/css/[name].[contenthash:8].css',
      disable  : false,
      allChunks: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),
    new BabiliPlugin()
  ],
  stats: {
    colors  : true,
    children: false,
    chunks  : false,
    modules : false
  }
}
