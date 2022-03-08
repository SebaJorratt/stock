import Vue from 'vue'
import VueRouter from 'vue-router'
import inicio from '../views/inicio.vue'

//Importamos nuestra store
import store from '../store/index.js'

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
    meta: {requireAuth: true}
  },
  {
    path: '/insumos',
    name: 'insumos',
    component: () => import('../views/insumos.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/productos',
    name: 'productos',
    component: () => import('../views/productos.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/dependencias',
    name: 'dependencias',
    component: () => import('../views/dependencias.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/funcionarios',
    name: 'funcionarios',
    component: () => import('../views/funcionarios.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/bodegas',
    name: 'bodegas',
    component: () => import('../views/bodegas.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/agregaUsuario',
    name: 'agregaUsuario',
    component: () => import('../views/agregarUsuario.vue'),
    meta: {requireAuth: true}
  },
  {
    path: '/configuracion',
    name: 'configuracion',
    component: () => import('../views/configuracion.vue'),
    meta: {requireAuth: true}
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const rutaProtegida = to.matched.some(record => record.meta.requireAuth)
  if(rutaProtegida && store.state.token === ''){
    next({name: 'inicio'})
  }else{
    next();
  }
});

export default router
