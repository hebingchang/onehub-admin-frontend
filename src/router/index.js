import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        component: () => import('../views/admin/Dashboard.vue'),
        name: '控制台',
        icon: 'dashboard'
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'config',
        component: () => import('../views/admin/Config.vue'),
        name: '配置',
        icon: 'setting'
      }
    ]
  },
  {
    path: '/init',
    name: 'init',
    component: () => import('../views/Init.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
