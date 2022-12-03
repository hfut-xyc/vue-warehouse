import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from "../views/Login.vue"

import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Warehouse from '../views/warehouse/Warehouse.vue'
import Product from '../views/product/Product.vue'
import Order from '../views/product/Order.vue'
import Chart from '../views/product/Chart.vue'
// import Employee from '../views/human/Employee.vue'
import WarehouseDetail from "../views/warehouse/WarehouseDetail"

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: '用户登录',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      meta: { requireAuth: true },
      children: [
        {
          path: '',
          redirect: 'warehouse'
        },
        {
          path: 'warehouse',
          name: "仓库信息",
          component: Warehouse,
          meta: { requireAuth: true }
        },
        {
          path: 'warehouse/:id/detail',
          name: "仓库详情",
          component: WarehouseDetail,
          meta: { requireAuth: true }
        },
        {
          path: 'inventory',
          name: "产品清单",
          component: Product,
          meta: { requireAuth: true }
        },
        {
          path: 'order',
          name: "订单管理",
          component: Order,
          meta: { requireAuth: true }
        },
        {
          path: 'user',
          name: "用户管理",
          component: User,
          meta: { requireAuth: true }
        },
        {
          path: 'chart',
          name: "数据统计",
          component: Chart,
          meta: { requireAuth: true }
        }
      ]
    }
  ]
});