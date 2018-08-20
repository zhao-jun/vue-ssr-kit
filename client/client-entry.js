import createApp from './create-app'

const { app, router } = createApp()

// 此处采用模版，新建root会导致挂载两次
router.onReady(() => {
  app.$mount('#root')
})
