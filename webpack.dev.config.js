const webpack       = require('webpack'),
  path              = require('path'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src')
const OUTPUT_DIR = path.resolve(__dirname, 'dist')

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [ SRC_DIR ]

module.exports = {
  devtool: 'source-map',
  cache  : true,
  context: __dirname,
  entry  : [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:8000',
    SRC_DIR + '/App.jsx'
  ],
  output: {
    path         : OUTPUT_DIR, // Next line is not used in dev but WebpackDevServer crashes without it:
    pathinfo     : true, // Add /* filename */ comments to generated require()s in the output.
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename     : 'dist/js/bundle.js',
    chunkFilename: 'dist/js/[name].chunk.js', // There are also additional JS chunk files if you use code splitting.
    publicPath   : '/' // This is the URL that app is served from. We use "/" in development.

    // path      : __dirname + '/static/',
    // publicPath: 'http://localhost:3000/static/',
    // filename  : 'client.js'
  },
  module: {
    loaders: [
      {
        test   : /\.jsx?$/,
        loader : 'babel-loader',
        exclude: /(node_modules)/,
        include: defaultInclude
      },
      {
        test   : /\.js$/,
        loader : 'babel-loader',
        include: path.join(__dirname, 'node_modules', 'redux-devtools', 'src'),
        include: defaultInclude
      },
      {
        test   : /\.json$/,
        loader : 'json-loader',
        include: defaultInclude
      },
      {
        test: /\.styl/,
        use : [
          'style-loader',
          {
            loader : 'css-loader',
            options: {
              modules       : true,
              localIdentName: '__[hash:base64:5]'
            }
          },
          'stylus-loader'
        ],
        include: defaultInclude
      }, {
        test: /\.css$/,
        use : [
          'style-loader',
          {
            loader : 'postcss-loader',
            options: {
              modules       : true,
              localIdentName: '__[hash:base64:5]'
            }
          }
        ],
        include: defaultInclude
      }
    ]
  },
  target : 'electron-renderer',
  resolve: {
    extensions: [ '.js', '.json', '.jsx' ]
  },
  plugins: [
    // // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.HotModuleReplacementPlugin(), // This is necessary to emit hot updates (currently CSS only):
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  performance: {
    hints: false
  }
}
