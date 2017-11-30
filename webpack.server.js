const webpack       = require('webpack'),
  WebpackDevServer  = require('webpack-dev-server'),
  webpackConfig     = require('./webpack.dev.config'),
  path              = require('path'),
  compiler          = webpack(webpackConfig)
const Dashboard         = require('webpack-dashboard')
const DashboardPlugin   = require('webpack-dashboard/plugin')

const { spawn } = require('child_process')

const OUTPUT_DIR = path.resolve(__dirname, 'dist')

// const mDashboard = new Dashboard()
// compiler.apply(new DashboardPlugin(mDashboard.setData))

new WebpackDevServer(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot       : true,
  quiet     : false, // MUESTRA LOG EN CONSOLA
  overlay   : false, // Show error full window
  stats     : {
    colors      : true,
    errorDetails: true
  },
  historyApiFallback: true,
  // Control the console log messages shown in the browser when using inline mode. Can be `error`, `warning`, `info` or `none`.
  clientLogLevel    : 'info',
  // // Set this if you want to enable gzip compression for assets
  compress          : true,
  before() {
    contentBase: OUTPUT_DIR,
    spawn(
      'electron',
      [ '.' ],
      { shell: true, env: process.env, stdio: 'inherit' }
    )
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError))
  }
}).listen(8000, 'localhost', err => {
  if(err)
    console.log('err', err)
})
