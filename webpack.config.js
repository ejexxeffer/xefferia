const path = require('path')
const WorkboxPlugin = require('workbox-webpack-plugin');

// const HTMLWebpackPlugin = require('html-webpack-plugin')
// const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './js/main.js',
  output: {
    // filename: '[name].[contenthash].js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
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
    // new WorkboxPlugin.GenerateSW({
    //   // mode: 'development',
    //   // sourcemap: true,
    //   swDest: './sw.js',
    //   // skipWaiting: true,
    //   // clientsClaim: true,
    //   // dontCacheBustURLsMatching: /-[a-z0-9]{20}\./,
    //   // navigateFallback: '/index.html',
    //   // // exclude: [
    //   // //   // Images don't need to be pre-cached (cache only if in use)
    //   // //   /\.(png|jpg|jpeg|webm|gif|svg|map)$/,
    //   // //   // Translations don't need to be pre-cached (cache only if in use)
    //   // //   /[a-z]{2}(?:-[A-Z]{2})?-[a-z0-9]{20}\.min\.js/
    //   // // ],
    //   // navigationPreload: true,
    //   // runtimeCaching: [{
    //   //   // Match any same-origin request that contains 'api'.
    //   //   urlPattern: '/api/*',
    //   //   // Apply a StaleWhileRevalidate strategy.
    //   //   handler: 'CacheFirst',
    //   //   options: {
    //   //     // Use a custom cache name for this route.
    //   //     cacheName: 'my-api-cache',
    //   //     // Configure custom cache expiration.
    //   //     expiration: {
    //   //       maxEntries: 5,
    //   //       maxAgeSeconds: 60,
    //   //     },
    //   //     // Configure background sync.
    //   //     backgroundSync: {
    //   //       name: 'my-queue-name',
    //   //       options: {
    //   //         maxRetentionTime: 60 * 60,
    //   //       },
    //   //     },
    //   //     // Configure which responses are considered cacheable.
    //   //     cacheableResponse: {
    //   //       statuses: [0, 200],
    //   //       headers: { 'x-test': 'true' },
    //   //     },
    //   //     // Configure the broadcast cache update plugin.
    //   //     broadcastUpdate: {
    //   //       channelName: 'my-update-channel',
    //   //       options: {
    //   //         notifyAllClients: true,
    //   //       },
    //   //     },
    //   //     // Add in any additional plugin logic you need.

    //   //     // matchOptions and fetchOptions are used to configure the handler.
    //   //     fetchOptions: {
    //   //       mode: 'no-cors',
    //   //     },
    //   //     matchOptions: {
    //   //       ignoreSearch: true,
    //   //     },
    //   //   },
    //   // }],
    //   // skipWaiting: true
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['css-loader', 'style-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ]
  }
}