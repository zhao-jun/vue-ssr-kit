const Router = require('koa-router')
const webpack = require('webpack')
const MemoryFS = require('memory-fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')

const webpackServerConfig = require('./../../build/webpack.config.client')

const mfs = new MemoryFS()
// webpack Compiler 实例
// .run(callback) 执行
// .watch(watchOptions, handler) 监听
const serverCompiler = webpack(webpackServerConfig)
// 使用 memory-fs 替换默认的 outputFileSystem，以将文件写入到内存中，而不是写入到磁盘
serverCompiler.outputFileSystem = mfs

let bundle
// 类似CLI 命令: webpack --watch
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  // 返回Json对象
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))

  const bundlePath = path.join(
    webpackServerConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  // 读取vue-ssr-server-bundle.json
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('bundle generated')
})

const handleSSR = ctx => {
  // 服务端初次打包未结束
  if (!bundle) {
    ctx.body = 'bundle 不存在'
    return
  }

  const clientManifest = require('../../client-dist/vue-ssr-client-manifest.json')

  // todo
  let template = require('../server.template.html')

  // 自动注入
  const renderer = createBundleRenderer(bundle, {
    template,
    clientManifest
  })

  renderer.renderToString({}, (err, html) => {
    if (err) throw err
    ctx.body = html
  })
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
