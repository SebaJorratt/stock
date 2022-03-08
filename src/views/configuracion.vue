<template>
  <div class="configuracion">
    <navbar />
      <div class="config">
        <h1>Mi Perfil</h1>
        <b-alert
            :show="dismissCountDown"
            dismissible
            :variant="mensaje.color"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
          >
            {{mensaje.texto}}
          </b-alert>  
        <div class="mt-5">
          <div id="centro"> 
            <b-container>
              <div class="card" style="border-color: black;">
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
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Contraseña Actual</label>
                          <input type="password" class="form-control" id="serieAgrega" aria-describedby="emailHelp" v-model="$v.password.$model">
                          <p class="text-danger" v-if="!$v.password.minLength">Mínimo de 6 caracteres</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Nueva Contraseña</label>
                          <input type="password" class="form-control" id="marcaAgrega" aria-describedby="emailHelp" v-model="$v.newPassword.$model">
                          <p class="text-danger" v-if="!$v.newPassword.minLength">Mínimo de 6 caracteres</p>
                        </div>
                      </b-col>
                      <b-col cols="12" md="4">
                        <div class="mb-3">
                          <label for="exampleInputEmail1" class="form-label">Confirmar Nueva Contraseña</label>
                          <input type="password" class="form-control" id="marcaAgrega" aria-describedby="emailHelp" v-model="$v.newPasswordConfirm.$model">
                          <p class="text-danger" v-if="!$v.newPasswordConfirm.sameAsPassword">Contraseña Incorrecta</p>
                        </div>
                      </b-col>
                    </b-row><br>
                    <b-row>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <b-button @click="mostrarContra()" class="btn-warning botonmostrar boton">{{contra}}</b-button>
                        </div>
                      </b-col>
                      <b-col cols="12" md="6">
                        <div class="mb-3">
                          <b-button @click="editarUsuario()" class="btn-success botonmostrar boton">Modificar mis Datos</b-button>
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

import { mapState } from 'vuex'

export default {
  name: "about",
  components: {
    navbar,
  },
  data() {
      return {
        contrasena: 'no',
        contra: 'Cambiar su contraseña',
        nombre: '',
        email: '',
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
      nombre:{required, minLength: minLength(10)},
      email:{required,email},
      password:{minLength: minLength(6), required},
      newPassword:{minLength: minLength(6), required},
      newPasswordConfirm:{sameAsPassword: sameAs('newPassword')}
    },
    created(){
      this.cargarUsuario();
    },
    computed: {
      ...mapState(['token'])
    },
    methods: {
      alerta(color, texto){
        this.mensaje.color = color;
        this.mensaje.texto = texto;
        this.showAlert();
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
            this.axios.put(`auth/actualizaUser`, {nomUsuario: this.nombre, correo: this.email}, config)
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
              if(!this.$v.newPasswordConfirm.$invalid){
                this.axios.put(`auth/actualizaUser`, {nomUsuario: this.nombre, correo: this.email, password: this.password, newPassword: this.newPassword}, config)
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
                this.alerta('danger', 'Repita la contaseña correctamente');
              }
            }else{
              this.alerta('danger', 'Porfavor ingrese su contraseña anterior y la nueva (Minmos 6 caracteres)');
            }
          }
        }else{
          this.alerta('danger', 'Porfavor ingrese todos los datos requeridos y un email valido');
        }
      },
      cargarUsuario(){
        let config = {
          headers: {
            token: this.token
          }
        }
        this.axios.get('auth/obtenerDatos', config)
          .then(res => {
            this.nombre = res.data[0].nomUsuario;
            this.email = res.data[0].correo;
          })
          .catch(e => {
            this.alerta('danger', 'No se han podido cargar los datos del usuario');
          })
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      }
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