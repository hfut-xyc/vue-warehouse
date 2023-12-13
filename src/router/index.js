import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes =  [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: '用户登录',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: '',
        redirect: 'warehouse'
      },
      {
        path: 'warehouse',
        name: '仓库管理',
        component: () => import('@/views/warehouse/index.vue'),
      },
      {
        path: 'warehouse/:id',
        name: '仓库详情',
        component: () => import('@/views/warehouse/WarehouseDetail.vue'),
      },
      {
        path: 'product',
        name: '产品管理',
        component: () => import('@/views/product/index.vue'),
      },
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'order',
        name: '订单管理',
        component: () => import('@/views/Layout.vue'),
        children: [
          {
            path: 'list',
            name: '订单列表',
            component: () => import('@/views/order/OrderList.vue'),
          },
          {
            path: 'chart',
            name: '订单统计',
            component: () => import('@/views/order/OrderChart.vue'),
          },
        ]
      },
    ]
  }
]

const vueRouter = new VueRouter({
  mode: 'history',
  routes: routes
})

// router.beforeEach((to, from, next) => {
//     // 设置标题
//     document.title = to.name ? to.name : "仓库信息管理系统"
//     if (to.meta.requireAuth) {
//       if (store.state.currentUser) {
//         next()
//       } else {
//     		next('/login')
//       }
//     } else {
//     		next()
//     }
// })

export default vueRouter