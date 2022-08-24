const path = require('path')
const WorkboxPlugin = require('workbox-webpack-plugin');

// const HTMLWebpackPlugin = require('html-webpack-plugin')
// const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = {
  context: path.resolve(__dirname,'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    // filename: '[name].[contenthash].js',
    filename: '[name].js',
    path: path.resolve(__dirname,'dist'),
    clean: true
  },
  devServer: {
    devMiddleware: {
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/',
      serverSideRender: true,
      writeToDisk: true,
      index: true,
    },
    static: './',
    port: 8080,
    host: '192.168.0.120',
    historyApiFallback: true,
    compress: true,
    open: true,
    hot: true,
  },
  devtool: 'inline-source-map',
  plugins: [
    
  ],
  module: {
    rules: [
      {
      test: /\.scss$/,
      use: ['css-loader','style-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
  ]
  }
}