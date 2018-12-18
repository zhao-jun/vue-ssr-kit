const chalk = require('chalk')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const templateRender = require('./template-render')

module.exports = async ctx => {
  const clientManifest = require('../../client-dist/public/vue-ssr-client-manifest.json')

  // 手动注入
  const renderer = createBundleRenderer(
    path.join(__dirname, '../../server-dist/vue-ssr-server-bundle.json'),
    {
      inject: false,
      clientManifest
    }
  )
  try {
    await templateRender(ctx, renderer)
  } catch (error) {
    console.log(chalk.blue.bgRed.bold(error))
  }
}
