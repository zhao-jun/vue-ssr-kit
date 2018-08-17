const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loader v15新增
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const basicConfig = require('./webpack.config.base')

// 服务器配置，是用于生成传递给 VueServerRenderer.createBundleRenderer 的 server bundle

const isDev = process.env.NODE_ENV === 'development'

// css module开发和生产命名区分
const localIdentName = isDev
  ? '[path][name]-[local]-[hash:base64:5]'
  : '[hash:base64:5]'

// 便于以后统一修改路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const plugins = [
  // vue-loader v15 请确保引入这个插件！
  new VueLoaderPlugin(),
  // 可以全局使用
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"',
      VUE_ENV: '"server"'
    }
  }),
  new ExtractTextWebpackPlugin('styles.[hash:8].css'),
  // 将服务端的整个输出，生成vue-ssr-server-bundle.json
  new VueSSRServerPlugin()
]

module.exports = webpackMerge(basicConfig, {
  // 默认是web，此处是服务端渲染
  target: 'node',
  // 对 bundle renderer 提供 source map 支持
  devtool: 'source-map',
  entry: resolve('client/server-entry.js'),
  output: {
    // 告知 server bundle 使用 CommonJS 风格导出模块
    libraryTarget: 'commonjs2',
    // 不用hash，服务端不用考虑缓存的问题
    filename: 'server-entry.js',
    path: resolve('server-dist')
  },
  // 服务端渲染没必要打包，直接从node_moudle引入即可
  externals: Object.keys(require('../package.json').dependencies),
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
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
          ]
        }),
        include: [resolve('client'), resolve('test')]
      }
    ]
  },
  plugins
})
