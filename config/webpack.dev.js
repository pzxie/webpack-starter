const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

// 开发环境需要的插件
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  entry: [
    path.resolve(__dirname, './webpack.dev.hot.js'),
    path.resolve(__dirname, '../src/index.js')
  ],
  // chunkhash是在生产环境的时候使用，开发环境使用hash
  output: {
    filename: ('js/[name].[hash].js'),
    chunkFilename: ('js/[id].[hash].js'),
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  mode: 'development',
  // cheap-module-eval-source-map is faster for development
  // false for production
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'static': path.resolve(__dirname, '../static')
    }
  },
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          /* test: /[\\/]node_modules[\\/]/,
           name: "vendor",
           chunks: "all"*/

          chunks: 'initial',
          minChunks: 3,
          name: 'commons',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|less)$/,
        // 这个会被转化为style标签放在头部，不太好，最好是作为单独文件存在
        // 开发时使用这个
        use: [{
          // creates style nodes from JS strings
          loader: "style-loader",
          options: {
            // sourceMap为真时方便定位源码
            sourceMap: true
          }
        }, {
          // translates CSS into CommonJS
          loader: "css-loader",
          options: {
            sourceMap: true
          }
        }, {
          // compiles Less to CSS
          loader: "less-loader",
          options: {
            sourceMap: true
          }
        }, {
          loader: "postcss-loader",
          options: {
            sourceMap: true
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: ('static/img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: ('static/fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // html插件，用于将css,js，还有自定义的参数配置到html文件中
    new HtmlWebpackPlugin({
      title: 'Custom template',
      // Load a custom template (lodash by default see the FAQ for details)
      template: 'index.html',
      inject: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
}