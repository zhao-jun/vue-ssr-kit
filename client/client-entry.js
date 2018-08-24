import createApp from './create-app'

const { app, router, store } = createApp()

// 保证激活时客户端状态和服务端相同
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
// 开发环境客户端第一次asyncData执行
if (process.env.NODE_ENV === 'development' && window.location.port === '8000') {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!activated.length) {
      return next()
    }
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {
      next()
    }).catch(next)
  })
}

// 此处采用模版，新建root dom会导致挂载两次
router.onReady(() => {
  // 可以避免生产中重复请求的问题，
  // 存在问题：开发环境客户端第一次asyncData不执行
  // 存在问题：路由组件重用还需要全局Vue.mixin
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!activated.length) {
      return next()
    }
    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {
      // 停止加载指示器(loading indicator)
      next()
    }).catch(next)
  })
  // 客户端激活
  app.$mount('#root')
})
