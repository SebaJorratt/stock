import Vue from 'vue'
import Vuex from 'vuex'

//Para tener el router con mis rutas de vistas
import router from '../router/index.js'

//Para decodificar el jwt
import decode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    usuarioDB: ''
  },
  mutations: {
    obtenerUsuario(state, payload){
      state.token = payload;
      if(payload === ''){
        state.usuarioDB = ''
      }else{
        state.usuarioDB = decode(payload);
        router.push({name: 'menu'})
      }
    }
  },
  actions: {
    guardarUsuario({commit}, payload){
      localStorage.setItem('token', payload);
      commit('obtenerUsuario', payload);
    },
    cerrarSesion({commit}){
      commit('obtenerUsuario', '');
      localStorage.removeItem('token');
      router.push({name: 'inicio'});
    },
    leerToken({commit}){
      const token = localStorage.getItem('token');
      if(token){
        commit('obtenerUsuario', token)
      }else{
        commit('obtenerUsuario', '')
      }
    },
    admin(){
      if(this.state.usuarioDB.data[0].tipoUsuario == 0){
        router.push({name: 'menu'});
      }
    }
  },
  modules: {
  },
  getters:{
    activo: state => !!state.token
  }
})
