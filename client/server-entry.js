import createApp from './create-app'

export default context =>
  new Promise((resolve, reject) => {
    const { app, router } = createApp()
    // 路由跳转
    router.push(context.url)

    router.onReady(() => resolve(app))
  })
