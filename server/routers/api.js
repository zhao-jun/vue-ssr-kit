const Router = require('koa-router')

const apiRouter = new Router({ prefix: '/api' })

const successResponse = (data) => {
  return {
    code: '0',
    httpCode: '200',
    data,
    msg: '成功'
  }
}

// Mock，此处可以请求端口、数据库
apiRouter
  .get('/home/list', (ctx) => {
    let list = [{
      id: 1,
      text: 'list1'
    }, {
      id: 2,
      text: 'list2'
    }, {
      id: 3,
      text: 'list3'
    }]
    ctx.body = successResponse(list)
  })

module.exports = apiRouter
