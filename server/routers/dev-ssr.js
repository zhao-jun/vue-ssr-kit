const Router = require('koa-router')
const webpack = require('webpack')
// const fs = require('fs')
const chalk = require('chalk')
const MemoryFS = require('memory-fs')
const axios = require('axios')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const templateRender = require('./template-render')
const webpackServerConfig = require('./../../build/webpack.config.server')

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
  // 内存中读取vue-ssr-server-bundle.json
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('bundle generated')
})

const handleSSR = async ctx => {
  // 服务端初次打包未结束
  if (!bundle) {
    ctx.body = 'bundle 正在打包中...'
    return
  }
  // vue-ssr-client-manifest.json在内存中，直接获取不到
  // const clientManifest = require('../../client-dist/vue-ssr-client-manifest.json')
  const clientManifestResp = await axios.get(
    `http://127.0.0.1:8000/public/vue-ssr-client-manifest.json`
  )
  const clientManifest = clientManifestResp.data

  // // 使用页面模版
  // let template = fs.readFileSync(
  //   path.join(__dirname, '../views/template.html'),
  //   'utf-8'
  // )

  // // 自动注入
  // const renderer = createBundleRenderer(bundle, {
  //   template,
  //   clientManifest
  // })
  // // 错误写法，里面非同步，ctx赋值不了
  // // renderer.renderToString(context, (err, html) => {
  // //   if (err) throw err
  // //   ctx.body = html
  // // })
  // // 使用页面模版
  // const context = { url: ctx.url }
  // try {
  //   let html = await renderer.renderToString(context)
  //   ctx.body = html
  // } catch (error) {
  //   console.log('render error', error)
  // }
  // 手动注入
  // bundle可以接受绝对路径、bundle 对象，此处没有绝对路径，所以传入bundle对象
  const renderer = createBundleRenderer(bundle, {
    inject: false,
    clientManifest
  })
  try {
    await templateRender(ctx, renderer)
  } catch (error) {
    console.log(chalk.blue.bgRed.bold(error))
  }
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
