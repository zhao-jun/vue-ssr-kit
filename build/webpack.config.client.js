const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loader v15新增
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const basicConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

// 便于以后统一修改路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const defaultPlugins = [
  // vue-loader v15 请确保引入这个插件！
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin(),
  // 可以在前端代码中使用
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  })
]

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
}

let config

if (isDev) {
  config = webpackMerge(basicConfig, {
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'less-loader'
          ],
          include: [resolve('src'), resolve('test')]
        }
      ]
    },
    devServer,
    plugins: defaultPlugins.concat([
      // webpack-dev-server hot
      new webpack.HotModuleReplacementPlugin()
    ])
  })
} else {
  config = webpackMerge(basicConfig, {
    entry: {
      app: resolve('src/index.js'),
      vender: ['vue']
    },
    output: {
      // 打包的时候使用chunkhash，hash所有打包文件hash值相同，其中一个文件改变就全部改变，不利于缓存
      filename: '[name].[chunkhash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          // 生产环境提取css
          use: ExtractTextWebpackPlugin.extract({
            fallback: 'vue-style-loader',
            use: ['css-loader', 'postcss-loader', 'less-loader']
          }),
          include: [resolve('src'), resolve('test')]
        }
      ]
    },
    // 把manifest提取出来，避免模块
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: {
        name: 'manifest'
      }
    },
    plugins: defaultPlugins.concat([
      new ExtractTextWebpackPlugin('styles.[hash:8].css')
    ])
  })
}

module.exports = config
