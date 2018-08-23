export default [
  {
    path: '/test/:id?',
    component: () => import('../views/test.vue'),
    name: 'test',
    props: true,
    meta: {
      title: 'test'
    }
  },
  {
    path: '/',
    // 懒加载，此处接收函数
    component: () => import('../views/home.vue'),
    name: 'home',
    meta: {
      title: 'home'
    }
  }
]
