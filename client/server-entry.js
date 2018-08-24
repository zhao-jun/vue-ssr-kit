import createApp from './create-app'

export default context =>
  new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    // 路由跳转
    router.push(context.url)

    router.onReady(() => {
      // 获取匹配组件
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          // asyncData参数
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(_ => {
        // 将已经渲染好的状态store放入上下文
        context.state = store.state
        // todo 存在问题：如果不存在title的时候要设置默认title
        context.title = router.currentRoute.meta.title || 'Document'
        resolve(app)
      })
    })
  })
