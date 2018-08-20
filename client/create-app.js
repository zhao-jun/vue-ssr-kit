import Vue from 'vue'
import App from './app.vue'
import VueRouter from 'vue-router'
import './assets/images/d.jpg'
import './assets/styles/test.less'
import createRouter from './config/router'

// 避免状态单例
// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
Vue.use(VueRouter)

export default () => {
  const router = createRouter()

  const app = new Vue({
    router,
    render: h => h(App)
  })

  return { app, router }
}
