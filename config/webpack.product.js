const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

// 生产环节需要的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CssOptimizePlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 开发环境需要的插件
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js')
  },
  // chunkhash是在生产环境的时候使用，开发环境使用hash
  output: {
    filename: ('js/[name].[chunkhash].js'),
    chunkFilename: ('js/[id].[chunkhash].js'),
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  mode: 'production',
  // cheap-module-eval-source-map is faster for development
  // false for production
  devtool: '#source-map',
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
        // 生产环境使用该配置，单独文件形式存在
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader', 'postcss-loader']
        })
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
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 每次build的时候先清除旧的静态文件
    new CleanWebpackPlugin(['dist', 'build'], {
      root: path.resolve(__dirname, '../../webpack'),
      // exclude: ['shared.js']
    }),
    // 压缩js文件
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }),
    // 公共样式单独整理出样式文件，便于缓存
    new ExtractTextPlugin({
      filename: ('css/[name].[chunkhash].css'),
      allChunks: true
    }),
    // 压缩css文件
    new CssOptimizePlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // html插件，用于将css,js，还有自定义的参数配置到html文件中
    new HtmlWebpackPlugin({
      title: 'Custom template',
      // Load a custom template (lodash by default see the FAQ for details)
      template: 'index.html',
      inject: true
      // 生产环境使用
      ,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),

    new CopyWebpackPlugin([
      {
        // 项目中放置静态文件的地方,该文件夹中的资源都是通过绝对路径'/'引用的
        // note: 在src下有个assets文件夹，里面的资源通过相对路径，或者require、import进行引用，会打包至相应的js文件中，与此文件夹不同
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static'),
        // 忽略以.开头的文件
        ignore: ['.*']
      }
    ]),

    new FriendlyErrorsPlugin()
  ]
}