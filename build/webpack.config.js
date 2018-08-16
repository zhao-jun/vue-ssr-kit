const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // vue-loader v15新增
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

// 便于以后统一修改路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

const config = {
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
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      // {
      //   test: /\.css$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader'
      //   ]
      // },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      // {
      //   test: /\.less$/,
      //   use: [
      //     'vue-style-loader',
      //     'css-loader',
      //     'postcss-loader',
      //     'less-loader'
      //   ]
      // },
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
  },
  plugins: [
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
}

if (isDev) {
  config.devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    hot: true
  }
  config.module.rules.push({
    test: /\.less$/,
    use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
    include: [resolve('src'), resolve('test')]
  })
  config.plugins.push(
    // webpack-dev-server hot
    new webpack.HotModuleReplacementPlugin()
  )
} else {
  config.entry = {
    app: resolve('src/index.js'),
    vender: ['vue']
  }
  // 把manifest提取出来，避免模块
  config.optimization = {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
  // 打包的时候使用chunkhash，hash所有打包文件hash值相同，其中一个文件改变就全部改变，不利于缓存
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.less$/,
    // 生产环境提取css
    use: ExtractTextWebpackPlugin.extract({
      fallback: 'vue-style-loader',
      use: ['css-loader', 'postcss-loader', 'less-loader']
    }),
    include: [resolve('src'), resolve('test')]
  })
  config.plugins.push(new ExtractTextWebpackPlugin('styles.[hash:8].css'))
}

module.exports = config
