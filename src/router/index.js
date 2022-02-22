import Vue from 'vue'
import VueRouter from 'vue-router'
import inicio from '../views/inicio.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: inicio
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('../views/menu.vue'),
  }
]

const router = new VueRouter({
  routes
})

export default router
