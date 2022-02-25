<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Dependencia</h1>
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
                      <th scope="col">Producto</th>
                      <th scope="col">Codigo de Barras</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Stock DirecReg</th>
                      <th scope="col">Stock Bodegas</th>
                      <th scope="col">Edición</th>
                      <th scope="col">Historial Entregas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in dependencias" :key="i.codigoBarra">
                      <td scope="row">{{i.producto}}</td>
                      <td>{{i.codigoBarra}}</td>
                      <td>{{i.marca}}</td>
                      <td>{{i.stock}}</td>
                      <td>{{i.stockbodega}}</td>
                      <td><b-button @click="Acteditar(i.codigoBarra)" class="btn-warning btn-sm" style="border-color: white;">Editar</b-button></td>
                      <td><b-button @click="ActHist(i.codigoBarra)" class="btn btn-sm" style="border-color: white;">Historial</b-button></td>
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
                                    <option disabled value="">Seleccione un estado posible</option>
                                    <option>Bueno</option>
                                    <option>Regular</option>
                                    <option>Malo</option>
                                    <option>Baja</option>
                                </select>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Comuna de la Dependencia</label>
                                <select class="form-control" v-model="comunaAgregar">
                                    <option disabled value="">Seleccione un estado posible</option>
                                    <option>Bueno</option>
                                    <option>Regular</option>
                                    <option>Malo</option>
                                    <option>Baja</option>
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
                                <b-button @click="AgregarDependencia()" class="btn-success btn-sm boton">Agregar Dependencia</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <div class="card mt-5" v-if="pestaña === 'editar'" style="border-color: black;">
                    <div class="card-header">
                        <h2>Editar el Producto {{codigoBarra}}</h2>
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
                                    <option disabled value="">Seleccione un estado posible</option>
                                    <option>Bueno</option>
                                    <option>Regular</option>
                                    <option>Malo</option>
                                    <option>Baja</option>
                                </select>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Comuna de la Dependencia</label>
                                <select class="form-control" v-model="comuna">
                                    <option disabled value="">Seleccione un estado posible</option>
                                    <option>Bueno</option>
                                    <option>Regular</option>
                                    <option>Malo</option>
                                    <option>Baja</option>
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
                                <b-button @click="AgregarDependencia()" class="btn-success btn-sm boton">Agregar Dependencia</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <b-row v-if="pestaña === 'historial'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver a Dependencias</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="historial" v-if="pestaña === 'historial'">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Dependencia</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Ver al Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in historial" :key="i.corrHistorial">
                      <td scope="row">{{i.corrHistorial}}</td>
                      <td>{{i.producto}}</td>
                      <td>{{i.fecha}}</td>
                      <td><b-button @click="ActDHist(i.corrHistorial)" class="btn-success btn-sm" style="border-color: white;">Detalles</b-button></td>
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
        //Variables del AGREGAR
        codDependenciaAgregar: '',
        nomDependenciaAgregar: '',
        tipoAgregar: '',
        comunaAgregar: '',
        direccionAgregar: '',
        //Variable para reconocer un producto
        codDependencia: '',
        //Variables para EDITAR
        nomDependencia: '',
        tipo: '',
        comuna: '',
        direccion: '',
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
        descripcionAgrega:{required},
        nomDependencia:{required},
        direccion:{required},
    },
    created(){
        this.cargarDependencias();
    },
    methods:{
        //Función que carga todas las dependencias
        cargarDependencias(){
            this.dependencias = [{producto: 'Bueno', codigoBarra: '8797828291', marca: 'XD', descripcion: 'Buen producto', stock: 20, stockbodega: 40}, {producto: 'Regular', codigoBarra: '879782asd8291', marca: 'XDD', descripcion: 'no tan bueno producto', stock: 25, stockbodega: 42}]
        },
        //Función para regresar a la vista inicial
        Volver(){
            this.pestaña = 'dependencias'
            $('#dependencias').DataTable()
            this.cargarDependencias();
        },
        //Funciones para cambiar las vistas
        ActAgregar(){
            this.pestaña = 'agregar'
            $('#dependencias').DataTable().destroy();
        },
        Acteditar(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'editar'
            $('#dependencias').DataTable().destroy();
            this.ObtenerDatos();
        },
        ActHist(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'historial'
            $('#dependencias').DataTable().destroy();
            this.cargarHistorial();
        },
        //Funciones de AGREGAR
        AgregarDependencia(){
            console.log('Agregar')
        },
        //FUNCIONES PARA EDITAR
        ObtenerDatos(){
            const index = this.dependencias.findIndex(item => item.codigoBarra == this.codigoBarra);
            var data = this.dependencias[index]
            this.producto = data.producto
            this.marca = data.marca
            this.descripcion = data.descripcion
        },
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
    },
    watch: {
      dependencias(val) {
        if(this.pestaña === 'dependencias'){
          $('#dependencias').DataTable().destroy();
          this.$nextTick(()=> {
            $('#dependencias').DataTable()
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
        width: 100%;
    }
    .boton{
        margin: 20px;
        width: 90%;
        border-radius: 12px !important;
        border-color: black !important;
    }
</style>