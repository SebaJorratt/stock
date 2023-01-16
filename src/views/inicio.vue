<template>
  <div class="home">
    <section class="vh-100" style="background-color: #eee;">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card shadow-2-strong" style="border-radius: 1rem;">
              <div class="card-body p-5 text-center">
                <h3 class="mb-4">Sistema de stock</h3>

                <div class="form-outline mb-4">
                  <label class="form-label" for="typeEmailX-2">Correo</label>
                  <input type="email" id="typeEmailX-2" class="form-control form-control-lg" placeholder="Ingrese su correo" v-model="$v.correo.$model"/>
                  <p class="text-danger" v-if="$v.correo.$error">Por favor ingrese un correo</p>
                </div>

                <div class="form-outline mb-4">
                  <label class="form-label" for="typePasswordX-2">Contraseña</label>
                  <input type="password" id="typePasswordX-2" class="form-control form-control-lg" placeholder="Ingrese su contraseña" v-model="$v.password.$model"/>
                  <p class="text-danger" v-if="!$v.password.minLength">Mínimo de 6 caracteres</p>
                </div>
                <b-button @click="login()" variant="primary" class="btn btn-primary border-dark boton" type="submit">Iniciar Sesión</b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators"
import { mapActions } from 'vuex';
export default {
  name: 'inicio',
  data(){
    return{
      //Datos del Login
      correo: '',
      password: ''
    }
  },
  validations:{
    //Se validan el email y la contraseña con un minimo de letras
    correo:{required,email},
    password:{required, minLength: minLength(6)}
  },
  methods: {
    ...mapActions(['guardarUsuario', 'leerToken']),
    login(){
      //Se revisa que se cumpla con los requerimientos y luego se busca al usuario en la base de datos
      this.$v.$touch()
      if(!this.$v.$invalid){
        this.axios.post('/auth/login', {correo: this.correo, password: this.password})
          .then(res => {
            const token = res.data.token;
            this.guardarUsuario(token);
          })
          .catch(e => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: e.response.data.mensaje,
              footer: 'Error al intentar Ingresar a su sesión'
            })
          })
      }else{
        Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Debe rellenar correctamente todos los campos',
              footer: 'Asegurese de que el email y la contraseña sean validas'
            })
      }
    }
  },
  created(){
    this.leerToken();
  }
}
</script>

<style>
  .boton{
    margin: 20px;
    width: 90%;
    border-radius: 12px !important;
    border-color: black;
    background-color: #0d6efd;
  }
  
  body{
    background-color: #eee;
  }
</style>
