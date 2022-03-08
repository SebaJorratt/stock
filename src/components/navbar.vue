<template>
  <div class="hello"> 
        <div id="navegador">
            <b-navbar toggleable="md" type="dark" variant="success">
                <b-container>
                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                    
                    <router-link to="/menu"> <img src="../assets/logoborde.png" alt="" width="50px" class="iconJunji">  <b-navbar-brand > Sistema de Stock</b-navbar-brand></router-link> 
                     <b-collapse id="nav-collapse" is-nav>
                         <b-navbar-nav>
                            <b-nav-item :to="{name: 'insumos'}">Entrega de Insumos </b-nav-item>
                            <b-nav-item :to="{name: 'productos'}">Productos</b-nav-item>
                            <b-nav-item :to="{name: 'dependencias'}">Dependencias</b-nav-item>
                            <b-nav-item :to="{name: 'funcionarios'}">Funcionarios</b-nav-item>
                            <b-nav-item :to="{name: 'bodegas'}">Bodegas</b-nav-item>
                        </b-navbar-nav>
                        <b-navbar-nav class="ml-auto">
                            <b-nav-form>
                                <div class="dropdown">
                                <button class="btn dropdown-toggle" type="button dark" style="border-color: black;" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {{nombre}}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><router-link to="/configuracion"><a class="dropdown-item" href="#">Ver perfil</a></router-link></li>
                                    <li v-if="activo"><router-link to="/agregaUsuario"><a class="dropdown-item" href="#" >Gestión de Usuarios</a></router-link></li>
                                    <li><a @click="cerrarSesion()" class="dropdown-item" href="#">Cerrar sesión</a></li>
                                </ul>
                                </div>
                            </b-nav-form>
                        </b-navbar-nav>
                     </b-collapse>  
                </b-container>
            </b-navbar>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
    name: 'navbar',
    methods:{
        ...mapActions(['cerrarSesion']),
        cargarUsuario(){
        let config = {
          headers: {
            token: this.token
          }
        }
        this.axios.get('auth/obtenerDatos', config)
          .then(res => {
            this.nombre = res.data[0].nomUsuario;
          })
        },
        verificar(){
            if(this.usuarioDB.data[0].tipoUsuario == 0){
                this.activo = false;
            }
        }
    },
    computed: {
      ...mapState(['token', 'usuarioDB']),
    },
    created(){
      this.cargarUsuario();
      this.verificar();
    },
    data() {
      return {
        nombre: '',
        activo: true
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  
</style>
