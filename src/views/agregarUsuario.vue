<template>
  <div class="configuracion">
    <navbar />
      <div class="config">
        <h1 v-if="pestaña === 'usuarios'">Listado de Usuarios</h1>
        <h1 v-if="pestaña === 'agregar'">Crear un nuevo usuario</h1>
        <h1 v-if="pestaña === 'editar'">Editar un usuario</h1>
        <b-alert
              :show="dismissCountDown"
              dismissible
              :variant="mensaje.color"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
              >
              {{mensaje.texto}}
            </b-alert>  <br>
        <div class="mt-2">
          <div id="centro"> 
            <b-container>
              <div class="row">
                <b-button @click="agregar()" class="btn-success botonAgregar" v-if="pestaña === 'usuarios'" style="border-color: black;">Agregar Usuario</b-button>
              </div><br>
              <div class="row">
                <table id='usuarios' class="table table-striped table-dark table-responsive-lg table-responsive-md" v-if="pestaña === 'usuarios'">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Correo</th>
                      <th scope="col">Editar</th>
                      <th scope="col">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in usuarios" :key="i.corrUsuario">
                      <td scope="row">{{i.corrUsuario}}</td>
                      <td>{{i.nomUsuario}}</td>
                      <td>{{i.correo}}</td>
                      <td>
                        <b-button @click="Acteditar(i.corrUsuario)" class="btn-warning btn-sm" style="border-color: white;">Editar</b-button>
                      </td>
                      <td>
                        <b-button @click="Eliminar(i.corrUsuario)" class="btn-sm btn-danger" style="border-color: white;">Eliminar</b-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div> <br v-if="pestaña === 'agregar'">
              <div class="card" v-if="pestaña === 'agregar'" style="border-color: black;">
                  <div class="card-body">
                    <b-row>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Nombre de Usuario</label>
                          <input type="text" class="form-control" id="newnombreUsuario" aria-describedby="emailHelp" v-model="$v.nombreAgrega.$model">
                          <p class="text-danger" v-if="!$v.nombreAgrega.required">Es necesario ingresar un nombre</p>
                          <p class="text-danger" v-if="!$v.nombreAgrega.minLength">El nombre debe tener un mínimo de 10 caracteres</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Correo de Usuario</label>
                          <input type="email" class="form-control" id="newcorreoUsuario" aria-describedby="emailHelp" v-model="$v.emailAgrega.$model">
                          <p class="text-danger" v-if="$v.emailAgrega.$error">Por favor ingrese un email</p>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Contraseña de Usuario</label>
                          <input type="password" class="form-control" id="newserieAgrega" aria-describedby="emailHelp" v-model="$v.passwordAgrega.$model">
                          <p class="text-danger" v-if="!$v.passwordAgrega.minLength">Mínimo de 6 caracteres</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Repetir Contraseña</label>
                          <input type="password" class="form-control" id="newserieAgrega" aria-describedby="emailHelp" v-model="$v.passwordConfirm.$model">
                          <p class="text-danger" v-if="!$v.passwordConfirm.sameAsPassword">Contraseña Incorrecta</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                            <label for="exampleInputEmail1" class="form-label">Tipo de usuario</label>
                            <select class="form-control" v-model="$v.tipo.$model">
                            <option disabled value="">Tipo de usuario</option>
                                <option value="1">Administrador</option>
                                <option value="0">Normal</option>
                            </select>
                        </div>
                      </b-col>
                    </b-row><br>
                    <b-row>
                        <b-col cols="12" md="6">
                          <button type="submit" @click="Volver()" class="btn btn-primary boton">Volver al Listado</button>&nbsp;&nbsp;
                        </b-col>
                        <b-col cols="12" md="6">
                          <b-button @click="agregarUsuario()" class="btn-success botonmostrar boton">Agregar</b-button>
                        </b-col>
                    </b-row>
                </div>
              </div><br v-if="pestaña === 'editar'">
              <div class="card" v-if="pestaña === 'editar'" style="border-color: black;">
                  <div class="card-body">
                    <b-row>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Nombre de Usuario</label>
                          <input type="text" class="form-control" id="nombreUsuario" aria-describedby="emailHelp" v-model="$v.nombre.$model">
                          <p class="text-danger" v-if="!$v.nombre.required">Es necesario ingresar un nombre</p>
                          <p class="text-danger" v-if="!$v.nombre.minLength">El nombre debe tener un mínimo de 10 caracteres</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Correo de Usuario</label>
                          <input type="email" class="form-control" id="correoUsuario" aria-describedby="emailHelp" v-model="$v.email.$model">
                          <p class="text-danger" v-if="$v.email.$error">Por favor ingrese un email</p>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row v-if="contrasena === 'si'">
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Contraseña Actual</label>
                          <input type="password" class="form-control" id="serieAgrega" aria-describedby="emailHelp" v-model="$v.password.$model">
                          <p class="text-danger" v-if="!$v.password.minLength">Mínimo de 6 caracteres</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Nueva Contraseña</label>
                          <input type="password" class="form-control" id="marcaAgrega" aria-describedby="emailHelp" v-model="$v.newPassword.$model">
                          <p class="text-danger" v-if="!$v.newPassword.minLength">Mínimo de 6 caracteres</p>
                        </div>
                      </b-col>
                    </b-row><br>
                    <b-row>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <b-button @click="mostrarContra()" class="btn-warning botonmostrar boton">{{contra}}</b-button>
                        </div>
                      </b-col>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <b-button @click="Volver()" class="botonmostrar boton">Volver al Listado</b-button>
                        </div>
                      </b-col>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <b-button @click="editarUsuario()" class="btn-success boton">Modificar mis Datos</b-button>
                        </div>
                      </b-col>
                    </b-row>
                </div>
              </div>
            </b-container>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from 'jquery'; 

import { mapState, mapActions } from 'vuex'

export default {
  name: "about",
  components: {
    navbar,
  },
  data() {
      return {
        nombreAgrega: '',
        emailAgrega: '',
        passwordAgrega: '',
        passwordConfirm: '',
        tipo: 0,
        usuarios: [],
        pestaña: 'usuarios',
        contrasena: 'no',
        contra: 'Cambiar su contraseña',
        nombre: '',
        email: '',
        password: '',
        newPassword: '',
        corr: 0,
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
      nombreAgrega:{required, minLength: minLength(10)},
      emailAgrega:{required,email},
      passwordAgrega:{required, minLength: minLength(6)},
      passwordConfirm:{sameAsPassword: sameAs('passwordAgrega')},
      tipo:{required},
      nombre:{required, minLength: minLength(10)},
      email:{required,email},
      password:{minLength: minLength(6), required},
      newPassword:{minLength: minLength(6), required}
    },
    computed: {
      ...mapState(['token'])
    },
    created(){
      this.listarUsuarios();
      this.admin();
    },
    methods: {
      ...mapActions(['admin']),
      alerta(color, texto){
        this.mensaje.color = color;
        this.mensaje.texto = texto;
        this.showAlert();
      },
      Acteditar(id){
        $('#usuarios').DataTable().destroy();
        this.pestaña = 'editar'
        this.corr = id;
        this.cargarUsuario();
      },
      mostrarContra(){
        if(this.contrasena === 'no'){
          this.contrasena = 'si'
          this.contra = 'No Cambiar contraseña'
        }else{
          this.contrasena = 'no'
          this.contra = 'Cambiar su contraseña'
        }
      },
      listarUsuarios(){
        let config = {
          headers: {
            token: this.token
          }
        }
        this.axios.get('auth/obtenerUsuarios', config)
          .then(res => {
            this.usuarios = res.data;
          })
          .catch(e => {
            this.alerta('danger', 'No se han podido cargar a los usuarios');
        })
      },
      //Función que determina la vista de agregar
      agregar(){
        $('#usuarios').DataTable().destroy();
        this.pestaña = 'agregar'
      }, 
      //Función que permite ingresar a un nuevo usuario por parte de un Administrador
      agregarUsuario(){
        let config = {
          headers: {
            token: this.token
          }
        }
        this.$v.$touch()
        if(!this.$v.nombreAgrega.$invalid && !this.$v.emailAgrega.$invalid && !this.$v.passwordAgrega.$invalid && !this.$v.passwordConfirm.$invalid){
          this.axios.post('auth/register', {nomUsuario: this.nombreAgrega, correo: this.emailAgrega, password: this.passwordAgrega, tipo: this.tipo}, config)
            .then(res => {
              Swal.fire(
                'Se ha generado un nuevo usuario',
                'Seleccione Ok para continuar',
                'success'
              )
            })
            .catch(e => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: e.response.data.mensaje,
                footer: 'Posible error del sistema'
              })
          })
        }else{
          this.alerta('danger', 'Porfavor ingrese valores validos');
        }
      },
      //Carga los datos de un usuario a editar
      cargarUsuario(){
        let config = {
          headers: {
            token: this.token
          }
        }
        this.axios.get(`auth/obtenUsuario/${this.corr}`, config)
          .then(res => {
            this.nombre = res.data[0].nomUsuario;
            this.email = res.data[0].correo;
          })
          .catch(e => {
            this.alerta('danger', 'No se han podido cargar los datos del usuario');
          })
      },
      //Función que edita a un usuario
      editarUsuario(){
        let config = {
          headers: {
            token: this.token
          }
        }
        this.$v.$touch()
        if(!this.$v.nombre.$invalid && !this.$v.email.$invalid){
          if(this.contrasena === 'no'){
            this.axios.put(`auth/actualizaUsuario/${this.corr}`, {nomUsuario: this.nombre, correo: this.email}, config)
              .then(res => {
                      Swal.fire(
                      'Se ha editado al usuario satisfactoriamente',
                      'Seleccione Ok para continuar',
                      'success'
                      )
              })
              .catch(e => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: e.response.data.mensaje,
                  footer: 'Error al intentar Ingresar a su seción'
                })
              })
          }else{
            if(!this.$v.password.$invalid && !this.$v.newPassword.$invalid){
              this.axios.put(`auth/actualizaUsuario/${this.corr}`, {nomUsuario: this.nombre, correo: this.email, password: this.password, newPassword: this.newPassword}, config)
                .then(res => {
                      Swal.fire(
                      'Se ha editado al usuario satisfactoriamente',
                      'Seleccione Ok para continuar',
                      'success'
                      )
                })
                .catch(e => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: e.response.data.mensaje,
                    footer: 'Error al intentar Ingresar a su seción'
                  })
                })
            }else{
              this.alerta('danger', 'Porfavor ingrese su contraseña anterior y la nueva (Minmos 6 caracteres)');
            }
          }
        }else{
          this.alerta('danger', 'Porfavor ingrese todos los datos requeridos y un email valido');
        }
      },
      //Función que permite eliminar a un usuario del sistema
      Eliminar(id){
        let config = {
          headers: {
            token: this.token
          }
        }
        swal.fire({
                title: '¿Seguro que desea eliminar a este usuario?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: '¡Si!'
            }).then((result) => {
                if (result.value) {
                  this.axios.delete(`auth/eliminaUsuario/${id}`, config)
                    .then(res => {
                      const index = this.usuarios.findIndex(item => item.corrUsuario == id);
                      this.usuarios.splice(index, 1)
                      Swal.fire(
                        'Se ha eliminado al usuario satisfactoriamente',
                        'Seleccione Ok para continuar',
                        'success'
                      )
                    })
                    .catch(e => {
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: e.response.mensaje,
                        footer: 'Error al intentar Ingresar a su seción'
                      })
                    })
                  }
            })
      },
      //Se reinicia la ruta para regresar a la pantalla Principal
      Volver(){
        this.pestaña = 'usuarios'
        this.listarUsuarios();
      }, 
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
    },
    watch: {
      usuarios(val) {
        if(this.pestaña === 'usuarios'){
          $('#usuarios').DataTable().destroy();
          this.$nextTick(()=> {
            $('#usuarios').DataTable()
          });
        }
      }
    },
    mounted(){
      $('#usuarios').DataTable();
    }
};
</script>

<style>
  .config{
    padding: 30px;
  }

  body{
    background-color: #eee;
  }
  .boton{
    margin: 20px;
    width: 90%;
    border-radius: 12px;
    border-color: black;
  }
</style>