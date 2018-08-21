import Vue from 'vue'
import App from './app.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import './assets/images/d.jpg'
import './assets/styles/test.less'

import createRouter from './config/router'
import createStore from './store/store'

// 避免状态单例
// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例
Vue.use(VueRouter)
Vue.use(Vuex)

export default () => {
  const router = createRouter()
  const store = createStore()

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
