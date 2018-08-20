import Vue from 'vue'
import App from './app.vue'
import VueRouter from 'vue-router'
import './assets/images/d.jpg'
import './assets/styles/test.less'
import createRouter from './config/router'

Vue.use(VueRouter)

// 服务端渲染共用creat-app，避免引用组件修改两次
// 服务端渲染采用模版的方式，客户端不能采用创建新的dom，否则会出现挂载两次
const root = document.createElement('div')
document.body.appendChild(root)

const router = createRouter()

new Vue({
  router,
  render: h => h(App)
}).$mount(root)
