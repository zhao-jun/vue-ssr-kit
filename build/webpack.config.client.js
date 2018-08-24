const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loader v15新增
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const basicConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'
// css module开发和生产命名区分
const localIdentName = isDev
  ? '[path][name]-[local]-[hash:base64:5]'
  : '[hash:base64:5]'

// 便于以后统一修改路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const defaultPlugins = [
  // vue-loader v15 请确保引入这个插件！
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin({
    template: resolve('build/template.html')
  }),
  // 可以在前端代码中使用
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  // 生成 `vue-ssr-client-manifest.json`。
  new VueSSRClientPlugin()
]

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: {
    index: '/public/index.html'
  },
  proxy: {
    '/api': 'http://127.0.0.1:3030'
  },
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
            // 原来vue-loader css-module配置移到这
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName,
                camelCase: true // 驼峰
              }
            },
            'postcss-loader',
            'less-loader'
          ],
          include: [resolve('client'), resolve('test')]
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
      app: resolve('client/client-entry.js'),
      vender: ['vue']
    },
    output: {
      // 打包的时候使用chunkhash，hash所有打包文件hash值相同，其中一个文件改变就全部改变，不利于缓存
      filename: '[name].[chunkhash:8].js',
      // 引用路径，node端做处理
      publicPath: '/public/'
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          // 生产环境提取css
          use: [
            process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
            // 原来vue-loader css-module配置移到这
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName,
                camelCase: true // 驼峰
              }
            },
            'postcss-loader',
            'less-loader'
          ],
          include: [resolve('client'), resolve('test')]
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
      // new ExtractTextWebpackPlugin('styles.[hash:8].css')
      new MiniCssExtractPlugin({
        filename: 'styles.[chunkhash:8].css'
      })
    ])
  })
}

module.exports = config
