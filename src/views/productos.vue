<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Productos</h1>
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
                <b-row v-if="pestaña === 'productos'">
                    <b-col cols="12" md="12">
                        <b-button @click="ActAgregar()" class="btn-success btn boton mt-5">Agregar Producto</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="productos" v-if="pestaña === 'productos'">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Codigo de Barras</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Stock DirecReg</th>
                      <th scope="col">Stock Bodegas</th>
                      <th scope="col">Edición</th>
                      <th scope="col">Historial Entregas</th>
                      <th scope="col">Ordenes de compras</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in productos" :key="i.codigoBarra">
                      <td scope="row">{{i.producto}}</td>
                      <td>{{i.codigoBarra}}</td>
                      <td>{{i.marca}}</td>
                      <td>{{i.stock}}</td>
                      <td>{{i.stockbodega}}</td>
                      <td><b-button @click="Acteditar(i.codigoBarra)" class="btn-warning btn-sm" style="border-color: white;">Editar</b-button></td>
                      <td><b-button @click="ActHist(i.codigoBarra)" class="btn btn-sm" style="border-color: white;">Historial</b-button></td>
                      <td><b-button @click="ActOrdenes(i.codigoBarra)" class="btn-success btn-sm" style="border-color: white;">Ordenes</b-button></td>
                    </tr>
                  </tbody>
                </table>
                <div class="card mt-5" v-if="pestaña === 'agregar'" style="border-color: black;">
                    <div class="card-header">
                        <h2>Agrega un Nuevo Producto</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Codigo de Barras</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.codigoAgregar.$model">
                                <p class="text-danger" v-if="$v.codigoAgregar.$error" >El codigo del Producto es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Nombre del Producto</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.productoAgregar.$model">
                                <p class="text-danger" v-if="$v.productoAgregar.$error" >El nombre del Producto es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Marca del Producto</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.marcaAgregar.$model">
                                <p class="text-danger" v-if="$v.marcaAgregar.$error" >La marca del Producto es Requerida</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="12">
                                <label for="exampleInputEmail1" class="form-label">Descripcion del Productos</label>
                                <textarea type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="$v.descripcionAgrega.$model"></textarea>
                                <p class="text-danger" v-if="$v.descripcionAgrega.$error" >La descripción del Producto es Requerida</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="12" md="6">
                                <b-button @click="Volver()" class="btn btn-sm boton">Volver al listado</b-button>
                            </b-col>
                            <b-col cols="12" md="6">
                                <b-button @click="AgregarProducto()" class="btn-success btn-sm boton">Agregar Producto</b-button>
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
                                <label for="exampleInputEmail1" class="form-label">Nombre del Producto</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.producto.$model">
                                <p class="text-danger" v-if="$v.producto.$error" >El nombre del Producto es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="6">
                                <label for="exampleInputEmail1" class="form-label">Marca del Producto</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.marca.$model">
                                <p class="text-danger" v-if="$v.marca.$error" >La marca del Producto es Requerida</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="12">
                                <label for="exampleInputEmail1" class="form-label">Descripcion del Productos</label>
                                <textarea type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="$v.descripcion.$model"></textarea>
                                <p class="text-danger" v-if="$v.descripcion.$error" >La descripción del Producto es Requerida</p>
                            </b-col>
                        </b-row>
                        <b-row class="mt-5">
                            <b-col cols="12" md="6">
                                <b-button @click="Volver()" class="btn btn-sm boton">Volver al listado</b-button>
                            </b-col>
                            <b-col cols="12" md="6">
                                <b-button @click="EditarProducto()" class="btn-success btn-sm boton">Editar Producto</b-button>
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
                      <th scope="col">Producto</th>
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

                <b-row v-if="pestaña === 'ordenes'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver a Productos</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="historial" v-if="pestaña === 'ordenes'">
                  <thead>
                    <tr>
                      <th scope="col">Codigo de Orden</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Proveedor</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Ver al Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in ordenes" :key="i.codOrden">
                      <td scope="row">{{i.codOrden}}</td>
                      <td>{{i.producto}}</td>
                      <td>{{i.proveedor}}</td>
                      <td>{{i.fecha}}</td>
                      <td><b-button @click="ActDOrdenes(i.codOrden)" class="btn-success btn-sm" style="border-color: white;">Detalles</b-button></td>
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
        pestaña: 'productos',
        productos: [],
        historial: [],
        ordenes: [],
        //Variables del AGREGAR
        codigoAgregar: '',
        productoAgregar: '',
        marcaAgregar: '',
        descripcionAgrega: '',
        //Variable para reconocer un producto
        codigoBarra: '',
        //Variables para EDITAR
        producto: '',
        marca: '',
        descripcion: '',
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
        //Validaciones de los input
        codigoAgregar:{required},
        productoAgregar:{required},
        marcaAgregar:{required},
        descripcionAgrega:{required},
        producto:{required},
        marca:{required},
        descripcion:{required},
    },
    created(){
        this.cargarProductos();
    },
    methods:{
        //Funcion que carga todos los productos del sistema
        cargarProductos(){
            this.productos = [{producto: 'Bueno', codigoBarra: '8797828291', marca: 'XD', descripcion: 'Buen producto', stock: 20, stockbodega: 40}, {producto: 'Regular', codigoBarra: '879782asd8291', marca: 'XDD', descripcion: 'no tan bueno producto', stock: 25, stockbodega: 42}]
        },
        //Función para regresar a la vista inicial
        Volver(){
            this.pestaña = 'productos'
            $('#productos').DataTable()
            this.cargarProductos();
        },
        //Funciones de activacion de vistas
        ActAgregar(){
            this.pestaña = 'agregar'
            $('#productos').DataTable().destroy();
        },
        Acteditar(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'editar'
            $('#productos').DataTable().destroy();
            this.ObtenerDatos();
        },
        ActHist(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'historial'
            $('#productos').DataTable().destroy();
            this.cargarHistorial();
        },
        ActOrdenes(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'ordenes'
            $('#productos').DataTable().destroy();
            this.cargarOrdenes();
        },
        //Funciones de AGREGAR
        AgregarProducto(){
            console.log('Agregar')
        },
        //FUNCIONES PARA EDITAR
        ObtenerDatos(){
            const index = this.productos.findIndex(item => item.codigoBarra == this.codigoBarra);
            var data = this.productos[index]
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
      await $('#productos').DataTable()
    },
    watch: {
      productos(val) {
        if(this.pestaña === 'productos'){
          $('#productos').DataTable().destroy();
          this.$nextTick(()=> {
            $('#productos').DataTable()
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