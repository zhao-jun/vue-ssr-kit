const Router = require('koa-router')
const send = require('koa-send')
const path = require('path')
// 处理静态资源，/public
const staticRouter = new Router({ prefix: '/public' })

staticRouter.get('*', async ctx => {
  await send(ctx, ctx.path, { root: path.join(__dirname, '../../client-dist') })
})

module.exports = staticRouter
