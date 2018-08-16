const path = require('path')
const vueLoaderConfig = require('./vue-loader.conf')

// 便于以后统一修改路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// 客户端和服务端共用webpack配置
module.exports = {
  // webpack4新增
  mode: process.env.NODE_ENV || 'development',
  target: 'web', // 默认值
  entry: resolve('src/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        include: [resolve('src'), resolve('test')],
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        // 依赖css-loader、vue-template-compiler
        loader: 'vue-loader',
        options: vueLoaderConfig,
        include: [resolve('src'), resolve('test')]
        // 推荐include
        // exclude: /node_modules/
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            // 依赖file-loader
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}
