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
  },
  {
    path: '/insumos',
    name: 'insumos',
    component: () => import('../views/insumos.vue'),
  },
  {
    path: '/productos',
    name: 'productos',
    component: () => import('../views/productos.vue'),
  },
  {
    path: '/dependencias',
    name: 'dependencias',
    component: () => import('../views/dependencias.vue'),
  },
  {
    path: '/funcionarios',
    name: 'funcionarios',
    component: () => import('../views/funcionarios.vue'),
  },
  {
    path: '/bodegas',
    name: 'bodegas',
    component: () => import('../views/bodegas.vue'),
  },
  {
    path: '/agregaUsuario',
    name: 'agregaUsuario',
    component: () => import('../views/agregarUsuario.vue')
  },
  {
    path: '/configuracion',
    name: 'configuracion',
    component: () => import('../views/configuracion.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
