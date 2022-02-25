<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Funcionarios</h1>
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
                <b-row v-if="pestaña === 'funcionarios'">
                    <b-col cols="12" md="12">
                        <b-button @click="ActAgregar()" class="btn-success btn boton mt-5">Agregar Dependencia</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="funcionarios" v-if="pestaña === 'funcionarios'">
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
                    <tr v-for="i in funcionarios" :key="i.codigoBarra">
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
                        <h2>Agregar una Funcionario</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Codigo de Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.codFuncionarioAgregar.$model">
                                <p class="text-danger" v-if="$v.codFuncionarioAgregar.$error">El codigo del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nomFuncionarioAgregar.$model">
                                <p class="text-danger" v-if="$v.nomFuncionarioAgregar.$error">El nombre del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <select class="form-control" v-model="dependenciaAgregar">
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
                                <label for="exampleInputEmail1" class="form-label">Correo del Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.correoAgregar.$model">
                                <p class="text-danger" v-if="$v.correoAgregar.$error">El correo del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Rut del Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.rutAgregar.$model">
                                <p class="text-danger" v-if="$v.rutAgregar.$error">El rut del Funcionario es Requerido</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="12" md="6">
                                <b-button @click="Volver()" class="btn btn-sm boton">Volver al listado</b-button>
                            </b-col>
                            <b-col cols="12" md="6">
                                <b-button @click="AgregarFuncionario()" class="btn-success btn-sm boton">Agregar Funcionario</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <div class="card mt-5" v-if="pestaña === 'editar'" style="border-color: black;">
                    <div class="card-header">
                        <h2>Editar un Funcionario</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nomFuncionario.$model">
                                <p class="text-danger" v-if="$v.nomFuncionario.$error">El nombre del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <select class="form-control" v-model="dependencia">
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
                                <label for="exampleInputEmail1" class="form-label">Correo del Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.correo.$model">
                                <p class="text-danger" v-if="$v.correo.$error">El correo del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Rut del Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.rut.$model">
                                <p class="text-danger" v-if="$v.rut.$error">El rut del Funcionario es Requerido</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="12" md="6">
                                <b-button @click="Volver()" class="btn btn-sm boton">Volver al listado</b-button>
                            </b-col>
                            <b-col cols="12" md="6">
                                <b-button @click="EditarFuncionario()" class="btn-success btn-sm boton">Editar Funcionario</b-button>
                            </b-col>
                        </b-row>
                    </div>
                </div>
                <b-row v-if="pestaña === 'historial'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver a Funcionarios</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="historial" v-if="pestaña === 'historial'">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Funcionario</th>
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
        pestaña: 'funcionarios',
        funcionarios: [],
        dependencias: [],
        historial: [],
        //Variables del AGREGAR
        codFuncionarioAgregar: '',
        nomFuncionarioAgregar: '',
        dependenciaAgregar: '',
        correoAgregar: '',
        rutAgregar: '',
        //Variable para reconocer un producto
        codFuncionario: '',
        //Variables para EDITAR
        nomFuncionario: '',
        dependencia: '',
        correo: '',
        rut: '',
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
        //Validaciones de los input
        codFuncionarioAgregar:{required},
        nomFuncionarioAgregar:{required},
        correoAgregar:{required},
        rutAgregar:{required},
        nomFuncionario:{required},
        correo:{required},
        rut:{required},
    },
    created(){
        this.cargarFuncionarios();
    },
    methods:{
        //Función para cargar los Funcionarios del sistema
        cargarFuncionarios(){
            this.funcionarios = [{producto: 'Bueno', codigoBarra: '8797828291', marca: 'XD', descripcion: 'Buen producto', stock: 20, stockbodega: 40}, {producto: 'Regular', codigoBarra: '879782asd8291', marca: 'XDD', descripcion: 'no tan bueno producto', stock: 25, stockbodega: 42}]
        },
        //Función para regresar a la vista inicial
        Volver(){
            this.pestaña = 'funcionarios'
            $('#funcionarios').DataTable()
            this.cargarFuncionarios();
        },
        //Funciones para cambiar de vistas
        ActAgregar(){
            this.pestaña = 'agregar'
            $('#funcionarios').DataTable().destroy();
        },
        Acteditar(codigoBarra){
            this.codFuncionario = codigoBarra
            this.pestaña = 'editar'
            $('#funcionarios').DataTable().destroy();
            this.ObtenerDatos();
        },
        ActHist(codigoBarra){
            this.codFuncionario = codigoBarra
            this.pestaña = 'historial'
            $('#funcionarios').DataTable().destroy();
            this.cargarHistorial();
        },
        //Funciones de AGREGAR
        AgregarFuncionario(){
            console.log('Agregar')
        },
        //FUNCIONES PARA EDITAR
        ObtenerDatos(){
            const index = this.funcionarios.findIndex(item => item.codigoBarra == this.codFuncionario);
            var data = this.funcionarios[index]
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
      await $('#funcionarios').DataTable()
    },
    watch: {
      funcionarios(val) {
        if(this.pestaña === 'funcionarios'){
          $('#funcionarios').DataTable().destroy();
          this.$nextTick(()=> {
            $('#funcionarios').DataTable()
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