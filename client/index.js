import Vue from 'vue'
import App from './app.vue'
import VueRouter from 'vue-router'
import './assets/images/d.jpg'
import './assets/styles/test.less'
import createRouter from './config/router'

Vue.use(VueRouter)

const root = document.createElement('div')
document.body.appendChild(root)

const router = createRouter()

new Vue({
  router,
  render: h => h(App)
}).$mount(root)
