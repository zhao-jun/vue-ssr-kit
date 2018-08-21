const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const render = require('koa-art-template')

const app = new Koa()

// 可以使用ejs等其他模版
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production'
})

// favicon处理
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, ctx.path, { root: path.join(__dirname, '../') })
  } else {
    await next()
  }
})

let pageRouter = require('./routers/dev-ssr')

app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 3030

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
