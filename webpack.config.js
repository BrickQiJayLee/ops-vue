const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: [{
            loader: 'babel-loader',
            options: {
                presets: ['es2015']
            }
        }],
        exclude: /node_modules\/(?!(vue-monaco-editor)\/).*/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CopyWebpackPlugin([
        {
            from: 'node_modules/monaco-editor/min/vs',
            to: 'vs',
        }
    ]),
    new webpack.DefinePlugin({
        'process.env': {
            OPS_RUN_MODE: JSON.stringify(process.env.OPS_RUN_MODE)
        }
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '~': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  devServer: {
    host: '127.0.0.1',
    port: 8010,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map',
})
