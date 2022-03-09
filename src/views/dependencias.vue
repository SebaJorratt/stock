<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Dependencia</h1>
            <h2 class="mt-1" v-if="pestaña === 'dependencias'"> Listado de Dependencias</h2>
            <h2 class="mt-1" v-if="pestaña === 'historial'"> Historial de entrega de insumos de la Dependencia: {{codDependencia}}</h2> 
            <h2 class="mt-1" v-if="pestaña === 'detalleHist'"> Detalle del historial numero: {{histo}}</h2>
            <b-alert
              :show="dismissCountDown"
              dismissible
              :variant="mensaje.color"
              @dismissed="dismissCountDown=0"
              @dismiss-count-down="countDownChanged"
              >
              {{mensaje.texto}}
            </b-alert>
            <div class="mt-1">
                <b-row v-if="pestaña === 'dependencias'">
                    <b-col cols="12" md="12">
                        <b-button @click="ActAgregar()" class="btn-success btn boton mt-5">Agregar Dependencia</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="dependencias" v-if="pestaña === 'dependencias'">
                  <thead>
                    <tr>
                      <th scope="col">Codigo Dependencia</th>
                      <th scope="col">Nombre Dependencia</th>
                      <th scope="col">Tipo Dependencia</th>
                      <th scope="col">Comuna</th>
                      <th scope="col">Dirección Dependencia</th>
                      <th scope="col">Edición</th>
                      <th scope="col">Entregas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in dependencias" :key="i.codDependencia">
                      <td scope="row">{{i.codDependencia}}</td>
                      <td>{{i.nomDependencia}}</td>
                      <td>{{i.tipo}}</td>
                      <td>{{i.comuna}}</td>
                      <td>{{i.direccion}}</td>
                      <td><b-button @click="Acteditar(i.codDependencia, i.corrUbicacion)" class="btn-warning btn-sm" style="border-color: white;">Editar</b-button></td>
                      <td><b-button @click="ActHist(i.codDependencia)" class="btn btn-sm" style="border-color: white;">Historial</b-button></td>
                    </tr>
                  </tbody>
                </table>
                <div class="card mt-5" v-if="pestaña === 'agregar'" style="border-color: black;">
                    <div class="card-header">
                        <h2>Agregar una Dependencia</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Codigo de Dependencia</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.codDependenciaAgregar.$model">
                                <p class="text-danger" v-if="$v.codDependenciaAgregar.$error">El codigo de la Dependencia es Requerida</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nomDependenciaAgregar.$model">
                                <p class="text-danger" v-if="$v.nomDependenciaAgregar.$error">El nombre de la Dependencia es Requerida</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Tipo de la Dependencia</label>
                                <select class="form-control" v-model="tipoAgregar">
                                    <option v-for="i in tipos" :key="i">{{i}}</option>
                                </select>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Comuna de la Dependencia</label>
                                <select class="form-control mh" v-model="comunaAgregar">
                                    <option v-for="i in comunas" :key="i">{{i}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Dirección de la Dependencia</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.direccionAgregar.$model">
                                <p class="text-danger" v-if="$v.direccionAgregar.$error">La dirección de la Dependencia es Requerida</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="12" md="6">
                                <b-button @click="Volver()" class="btn btn-sm boton">Volver al listado</b-button>
                            </b-col>
                            <b-col cols="12" md="6">
                                <b-button @click="AgregarUbicacion()" class="btn-success btn-sm boton">Agregar Dependencia</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <div class="card mt-5" v-if="pestaña === 'editar'" style="border-color: black;">
                    <div class="card-header">
                        <h2>Editar una Dependencia</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nomDependencia.$model">
                                <p class="text-danger" v-if="$v.nomDependencia.$error">El nombre de la Dependencia es Requerida</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Tipo de la Dependencia</label>
                                <select class="form-control" v-model="tipo">
                                    <option v-for="i in tipos" :key="i">{{i}}</option>
                                </select>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Comuna de la Dependencia</label>
                                <select class="form-control" v-model="comuna">
                                    <option v-for="i in comunas" :key="i">{{i}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Dirección de la Dependencia</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.direccion.$model">
                                <p class="text-danger" v-if="$v.direccion.$error">La dirección de la Dependencia es Requerida</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="12" md="6">
                                <b-button @click="Volver()" class="btn btn-sm boton">Volver al listado</b-button>
                            </b-col>
                            <b-col cols="12" md="6">
                                <b-button @click="EditarUbicacion()" class="btn-success btn-sm boton">Editar Dependencia</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <b-row v-if="pestaña === 'historial'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver a Productos</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="historial" v-if="pestaña === 'historial'">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Funcionario</th>
                      <th scope="col">Dependencia</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Ver al Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in historial" :key="i.corrHistorial">
                      <td scope="row">{{i.corrHistorial}}</td>
                      <td>{{i.nomFuncionario}}</td>
                      <td>{{i.nomDependencia}}</td>
                      <td>{{i.fecha}}</td>
                      <td><b-button @click="ActDHist(i.corrHistorial)" class="btn-success btn-sm" style="border-color: white;">Detalles</b-button></td>
                    </tr>
                  </tbody>
                </table>

                <b-row v-if="pestaña === 'detalleHist'">
                    <b-col cols="12" md="12">
                        <b-button @click="VolverHist()" class="btn btn boton mt-5">Volver al Historial</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="detalleHist" v-if="pestaña === 'detalleHist'">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Codigo Barra</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in detalleHist" :key="i.corrHistProd">
                      <td scope="row">{{i.corrHistProd}}</td>
                      <td>{{i.codigoBarra}}</td>
                      <td>{{i.nomProducto}}</td>
                      <td>{{i.cantidad}}</td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </b-container>
    </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import { required, minLength} from "vuelidate/lib/validators";

import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 

import { mapState } from 'vuex'
export default {
    name: "about",
    components: {
        navbar,
    },
    data() {
      return {
        //Datos para agregar un nuevo memo (historial) con v-model
        pestaña: 'dependencias',
        dependencias: [],
        historial: [],
        detalleHist: [],
        comunas: ['Canela', 'Illapel', 'Los Vilos', 'Salamanca', 'Andacollo', 'Coquimbo', 'La Higuera', 'La Serena', 'Paihuano', 'Vicuña', 'Combarbalá', 'Monte Patria', 'Ovalle',
                'Punitaqui', 'Río Hurtado'],
        tipos: ['MDS', 'Alternativo', 'Otro Tipo'],
        //Variables del AGREGAR
        codDependenciaAgregar: '',
        nomDependenciaAgregar: '',
        tipoAgregar: '',
        comunaAgregar: '',
        direccionAgregar: '',
        //Variable para reconocer un producto
        codDependencia: '',
        corrUbicacion: '',
        //Variables para EDITAR
        nomDependencia: '',
        tipo: '',
        comuna: '',
        direccion: '',
        //Variable Historial
        histo: 0,
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
        //Validaciones de los input
        codDependenciaAgregar:{required},
        nomDependenciaAgregar:{required},
        direccionAgregar:{required},
        nomDependencia:{required},
        direccion:{required},
    },
    computed: {
      ...mapState(['token', 'usuarioDB'])
    },
    created(){
        this.cargarDependencias();
        this.comunaAgregar = this.comunas[0];
        this.tipoAgregar = this.tipos[0];
    },
    methods:{
        //Función que carga todas las dependencias
        cargarDependencias(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('api/obtenerDependencias', config)
            .then(res => {
                this.dependencias = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar las Dependencias');
            })
        },
        //Función para regresar a la vista inicial
        Volver(){
            $('#historial').DataTable().destroy();
            this.pestaña = 'dependencias'
            $('#dependencias').DataTable()
            this.cargarDependencias();
        },
        VolverHist(){
            $('#detalleHist').DataTable().destroy();
            this.pestaña = 'historial'
            this.cargarHistorial();
            $('#historial').DataTable()
        },
        //Funciones para cambiar las vistas
        ActAgregar(){
            this.pestaña = 'agregar'
            $('#dependencias').DataTable().destroy();
        },
        Acteditar(codDependencia, corrUbicacion){
            this.codDependencia = codDependencia
            this.corrUbicacion = corrUbicacion
            this.pestaña = 'editar'
            $('#dependencias').DataTable().destroy();
            this.ObtenerDatos();
        },
        ActHist(codDependencia){
            this.codDependencia = codDependencia
            this.pestaña = 'historial'
            $('#dependencias').DataTable().destroy();
            this.cargarHistorial();
        },
        ActDHist(corrHistorial){
            this.histo = corrHistorial;
            this.pestaña = 'detalleHist'
            $('#historial').DataTable().destroy();
            $('#detalleHist').DataTable()
            this.cargarDetalleHistorial();
        },
        //Funciones de AGREGAR
        //Función que se encarga de agregar una nueva ubicacion
        AgregarUbicacion(){
            this.$v.$touch()
            if(!this.$v.codDependenciaAgregar.$invalid && !this.$v.nomDependenciaAgregar.$invalid && !this.$v.direccionAgregar.$invalid){
                let config = {
                    headers: {
                        token: this.token
                    }
                }
                this.axios.post('api/agregaUbicacion', {comuna: this.comunaAgregar, direccion: this.direccionAgregar}, config)
                    .then(res => {
                    if(!res.data.sqlMessage){
                        this.AgregarDependencia();
                    }else{
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha creado la ubicacion Ingresada',
                        footer: 'A ocurrido un error en el ingreso de los datos'
                        })
                    }
                    })
                    .catch(e => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se ha creado este nuevo tipo',
                            footer: 'Posible error del sistema'
                        })
                    })
            }else{
                this.alerta('danger', 'Porfavor ingrese todos los campos requeridos')
            }
        },
        //Función que se encarga de agregar una nueva Dependencia
        AgregarDependencia(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.post('api/agregaDependencia', {codDependencia: this.codDependenciaAgregar, tipo: this.tipoAgregar, nomDependencia: this.nomDependenciaAgregar}, config)
                .then(res => {
                if(!res.data.sqlMessage){
                    Swal.fire(
                        'Se ha generado una nueva Dependencia',
                        'Seleccione Ok para continuar',
                        'success'
                    )
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha creado la nueva Dependencia',
                        footer: 'El codigo de la Dependencia y/o el nombre ya existen en este sistema'
                    })
                }
                })
                .catch(e => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha creado la nueva Dependencia',
                        footer: 'Posible error del sistema'
                    })
                })
        },
        //FUNCIONES PARA EDITAR
        //Función que permite obtener los datos de la dependencia a editar
        ObtenerDatos(){
            const index = this.dependencias.findIndex(item => item.codDependencia == this.codDependencia);
            var data = this.dependencias[index]
            this.nomDependencia = data.nomDependencia
            this.tipo = data.tipo
            this.comuna = data.comuna
            this.direccion = data.direccion
        },
        //PARA EDITAR UNA DEPENDENCIA PRIMERO SE DEBE EDITAR SU UBICACION POR LO QUE SE GENERA UNA NUEVA
        EditarUbicacion(){
            this.$v.$touch()
            if(!this.$v.nomDependencia.$invalid && !this.$v.direccion.$invalid){
                let config = {
                    headers: {
                        token: this.token
                    }
                }
                this.axios.post('api/agregaUbicacion', {comuna: this.comuna, direccion: this.direccion}, config)
                    .then(res => {
                    if(!res.data.sqlMessage){
                        this.EditarDependencia();
                    }else{
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha creado la ubicacion Ingresada',
                        footer: 'A ocurrido un error en el ingreso de los datos'
                        })
                    }
                    })
                    .catch(e => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se ha creado la ubicacion Ingresada',
                            footer: 'Posible error del sistema'
                        })
                    })
            }else{
                this.alerta('danger', 'Rellene todos los campos para editar la dependencia')
            }
        },
        //Luego de agregar la nueva ubicacion editamos los datos de la Dependencia
        EditarDependencia(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.put(`api/editarDependencia/${this.codDependencia}`, {nomDependencia: this.nomDependencia, tipo: this.tipo}, config)
                .then(res => {
                if(!res.data.sqlMessage){
                    this.EliminarUbicacion();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha actualizado el producto',
                        footer: 'Dato repetido asegurese de que el codigo o nombre ya existan'
                    })
                }
                })
                .catch(e => {
                    this.alerta('danger', 'No se ha logrado editar a la Dependencia');
                })
        },
        //Ahora eliminamos la ubicacion que anteriormente estaba relacionada con esta dependencia
        EliminarUbicacion(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.delete(`api/eliminarUbicacion/${this.corrUbicacion}`, config)
                .then(res => {
                if(!res.data.sqlMessage){
                    Swal.fire(
                        'Se ha logrado editar la Dependencia con exito!',
                        'Seleccione Ok para continuar',
                        'success'
                    )
                    this.Volver();
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha actualizado la Dependencia',
                        footer: 'Se encontro un error con la ubicación'
                    })
                }
                })
                .catch(e => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha actualizado la Dependencia',
                        footer: 'ERROR al cambiar la ubicación'
                    });
                })
        },
        //TABLAS DE HISTORIALES
        //CARGAR LOS DATOS DE LA TABLA HISTORIAL
        cargarHistorial(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerHistorialesDependencia/${this.codDependencia}`, config)
            .then(res => {
                this.historial = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar el historial');
            })
        },
        //Cargar los detalles de un historial
        cargarDetalleHistorial(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerHistorial/${this.histo}`, config)
            .then(res => {
                this.detalleHist = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar el detalle del historial');
            })
        },
        //FUNCIONES PARA LAS ALERTAS
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.dismissCountDown = this.dismissSecs
        },
        alerta(color, texto){
            this.mensaje.color = color;
            this.mensaje.texto = texto;
            this.showAlert();
        },
    },
    
    async mounted(){
      await $('#dependencias').DataTable()
      await $('#historial').DataTable()
      await $('#detalleHist').DataTable()
    },
    watch: {
      dependencias(val) {
        if(this.pestaña === 'dependencias'){
          $('#dependencias').DataTable().destroy();
          this.$nextTick(()=> {
            $('#dependencias').DataTable()
          });
        }
      },
      detalleHist(val) {
        if(this.pestaña === 'detalleHist'){
          $('#detalleHist').DataTable().destroy();
          this.$nextTick(()=> {
            $('#detalleHist').DataTable()
          });
        }
      },
      historial(val) {
        if(this.pestaña === 'historial'){
          $('#historial').DataTable().destroy();
          this.$nextTick(()=> {
            $('#historial').DataTable()
          });
        }
      }
    }
}
</script>

<style>
    body{
        background-color: #eee;
    }

    .texto{
        text-align: center;
    }

    .imagen{
        width: 50%;
    }
    .boton{
        margin: 20px;
        width: 90%;
        border-radius: 12px !important;
        border-color: black !important;
    }
    
</style>