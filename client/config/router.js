import Router from 'vue-router'
import routes from './routes'

// 服务端渲染需要每次导出新的路由
export default () =>
  new Router({
    routes,
    mode: 'history'
  })
