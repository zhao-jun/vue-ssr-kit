const Router = require('koa-router')
const handleSSR = require('../render/ssr')
const devhandleSSR = require('../render/dev-ssr')

const isDev = process.env.NODE_ENV === 'development'

let renderRouter = new Router()
if (isDev) {
  renderRouter.get('*', devhandleSSR)
} else {
  renderRouter.get('*', handleSSR)
}

module.exports = renderRouter
