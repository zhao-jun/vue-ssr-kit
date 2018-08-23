import createApp from './create-app'

const { app, router, store } = createApp()

// 保证激活时客户端状态和服务端相同
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 此处采用模版，新建root会导致挂载两次
router.onReady(() => {
  // 客户端激活
  app.$mount('#root')
})
