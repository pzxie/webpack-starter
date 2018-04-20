const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

// 生产环节需要的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 开发环境需要的插件
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  entry: [
    'webpack-hot-middleware/client?noInfo=true&reload=true'
    , path.resolve(__dirname, '../src/index.js')
  ],
  // chunkhash是在生产环境的时候使用，开发环境使用hash
  output: {
    filename: ('js/[name].[hash].js'),
    chunkFilename: ('js/[id].[hash].js'),
    // filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  // cheap-module-eval-source-map is faster for development
  // false for production
  devtool: 'cheap-module-eval-source-map' || false,
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
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
    rules: [
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
        }]

        // 生产环境使用该配置，单独文件形式存在
       /* use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader']
        })*/
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
  }
}