export default [
  {
    path: '/',
    // 懒加载，此处接收函数
    component: () => import('../views/home.vue'),
    name: 'home',
    meta: {
      title: 'home'
    }
  },
  {
    path: '/test',
    component: () => import('../views/test.vue'),
    name: 'test',
    meta: {
      title: 'test'
    }
  }
]
