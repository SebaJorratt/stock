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
                      <th scope="col">Stock Critico</th>
                      <th scope="col">Nombre Bodega</th>
                      <th scope="col">Edición</th>
                      <th scope="col">Historial Entregas</th>
                      <th scope="col">Ordenes de compras</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in productos" :key="i.codigoBarra">
                      <td scope="row">{{i.nomProducto}}</td>
                      <td>{{i.codigoBarra}}</td>
                      <td>{{i.marca}}</td>
                      <td>{{i.stock}}</td>
                      <td>{{i.stockBodega}}</td>
                      <td>{{i.stockCritico}}</td>
                      <td>{{i.nomBodega}}</td>
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
                        <b-row class="mt-4" v-for="i in bodegas" :key="i.nomBodega">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Nombre Bodega</label>
                                <input disabled type="text" class="form-control" aria-describedby="emailHelp" v-model="i.nomBodega">
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Stock de Bodega</label>
                                <input type="number" @change="cantMin(i.nomBodega)" class="form-control" v-model="i.stockBodega">
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Stock Critico</label>
                                <input type="number" @change="cantMinCritico(i.nomBodega)" class="form-control" v-model="i.stockCritico">
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
                        <h2>Editar un Producto</h2>
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
                        <b-row class="mt-4">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Nombre Bodega</label>
                                <input disabled type="text" class="form-control" aria-describedby="emailHelp" v-model="nomBodegaEditar">
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Stock de Bodega</label>
                                <input disabled type="text" class="form-control" aria-describedby="emailHelp" v-model="stockBodegaEditar">
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Stock Critico</label>
                                <input type="number" @change="cantMinCriticoEditar(stockCriticoEditar)" class="form-control" v-model="stockCriticoEditar">
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

                <b-row v-if="pestaña === 'ordenes'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver a Productos</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="ordenes" v-if="pestaña === 'ordenes'">
                  <thead>
                    <tr>
                      <th scope="col">Codigo de Orden</th>
                      <th scope="col">Bodega</th>
                      <th scope="col">Proveedor</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Ver al Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in ordenes" :key="i.codOrden">
                      <td scope="row">{{i.codOrden}}</td>
                      <td>{{i.nomBodega}}</td>
                      <td>{{i.proveedor}}</td>
                      <td>{{i.fecha}}</td>
                      <td><b-button @click="ActDOrdenes(i.codOrden)" class="btn-success btn-sm" style="border-color: white;">Detalles</b-button></td>
                    </tr>
                  </tbody>
                </table>

                <b-row v-if="pestaña === 'detalleOrden'">
                    <b-col cols="12" md="12">
                        <b-button @click="VolverORD()" class="btn btn boton mt-5">Volver al Historial</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="detalleOrden" v-if="pestaña === 'detalleOrden'">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Codigo Barra</th>
                      <th scope="col">Producto</th>
                      <th scope="col">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in detalleOrden" :key="i.corrOrdenProducto">
                      <td scope="row">{{i.corrOrdenProducto}}</td>
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
        bodegas: [],
        bod: [],
        detalleHist: [],
        detalleOrden: [],
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
        stockBodegaEditar: 0,
        stockCriticoEditar: 0,
        nomBodegaEditar: '',
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
        this.cargarBodegas();
    },
    methods:{
        //Funcion que carga todos los productos del sistema
        cargarProductos(){
            this.axios.get('api/obtenerProductos')
            .then(res => {
                this.productos = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar los Productos');
            })
        },
        //Función que se encarga de obtener todas las bodegas existentes
        cargarBodegas(){
            this.axios.get('api/obtenerbodegas')
            .then(res => {
                this.bod = res.data;
                this.llenarBodegas();
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar las bodegas');
            })
        },
        //Función que se encarga de establecer el stock de estas bodegas
        llenarBodegas(){
            for(var i = 0; i < this.bod.length; i++){
                this.bodegas.push({nomBodega: this.bod[i].nomBodega, stockBodega: 1, stockCritico: 1})
            }
        },
        //Función para regresar a la vista inicial
        Volver(){
            $('#historial').DataTable().destroy();
            $('#ordenes').DataTable().destroy()
            this.pestaña = 'productos'
            this.cargarProductos();
            $('#productos').DataTable()
        },
        VolverHist(){
            $('#detalleHist').DataTable().destroy();
            this.pestaña = 'historial'
            this.cargarHistorial();
            $('#historial').DataTable()
        },
        VolverORD(){
            $('#detalleOrden').DataTable().destroy();
            this.pestaña = 'ordenes'
            this.cargarOrdenes();
            $('#ordenes').DataTable()
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
            $('#productos').DataTable().destroy();
            this.pestaña = 'historial'
            $('#historial').DataTable()
            this.cargarHistorial();
        },
        ActOrdenes(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'ordenes'
            $('#productos').DataTable().destroy();
            $('#ordenes').DataTable()
            this.cargarOrdenes();
        },
        ActDHist(corrHistorial){
            this.histo = corrHistorial;
            this.pestaña = 'detalleHist'
            $('#historial').DataTable().destroy();
            $('#detalleHist').DataTable()
            this.cargarDetalleHistorial();
        },
        ActDOrdenes(codOrden){
            this.histo = codOrden;
            this.pestaña = 'detalleOrden';
            $('#ordenes').DataTable().destroy();
            $('#detalleOrden').DataTable()
            this.cargarDetalleOrden();
        },
        //Funciones de AGREGAR
        //Función que se encarga de agregar un producto al sistema
        AgregarProducto(){
            this.$v.$touch()
            if(!this.$v.codigoAgregar.$invalid && !this.$v.productoAgregar.$invalid && !this.$v.marcaAgregar.$invalid && !this.$v.descripcionAgrega.$invalid){
                this.axios.post('api/agregaProducto', {codigoBarra: this.codigoAgregar, nomProducto: this.productoAgregar, marca: this.marcaAgregar, descripcion: this.descripcionAgrega})
                    .then(res => {
                    if(!res.data.sqlMessage){
                        this.agregarStock();
                    }else{
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha creado este nuevo tipo',
                        footer: 'Codigo o nombre de Producto ya utilizado'
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
                this.alerta('danger', 'Porfavor ingrese todos los campos requeridos');
            }
        },
        //Funcion que agrega el stock del Producto
        agregarStock(){
            for(var i = 0; i < this.bodegas.length; i++){
                this.axios.post('api/agregaProductoBodega', {stockBodega: this.bodegas[i].stockBodega, stockCritico: this.bodegas[i].stockCritico, nomBodega: this.bodegas[i].nomBodega, codigoBarra: this.codigoAgregar})
                    .then(res => {
                    if(!res.data.sqlMessage){
                        Swal.fire(
                            'Se ha generado un nuevo Producto',
                            'Seleccione Ok para continuar',
                            'success'
                        )
                    }else{
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha logrado ingresar los stock del producto',
                        footer: 'Error con el ingreso de Stocks'
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
            }
        },
        //Indicamos el minimo de cantidad para que no este vacio o sea menor a 0
        cantMin(nomBodega){
            const index = this.bodegas.findIndex(item => item.nomBodega == nomBodega);
            if(this.bodegas[index].stockBodega < 1){
                this.bodegas[index].stockBodega = 1;
            }
            if(this.bodegas[index].stockBodega < this.bodegas[index].stockCritico){
                this.alerta('danger', 'El stock que esta ingresando es menor al critico para la bodega ' + this.bodegas[index].nomBodega)
            }
        },
        //Indicamos el minimo de cantidad para que no este vacio o sea menor a 0
        cantMinCritico(nomBodega){
            const index = this.bodegas.findIndex(item => item.nomBodega == nomBodega);
            if(this.bodegas[index].stockCritico < 1){
                this.bodegas[index].stockCritico = 1;
            }
            if(this.bodegas[index].stockCritico > this.bodegas[index].stockBodega ){
                console.log(this.bodegas[index].stockBodega, this.bodegas[index].stockCritico)
                this.alerta('danger', 'El stock que esta ingresando es menor al critico para la bodega ' + this.bodegas[index].nomBodega)
            }
        },
        //FUNCIONES PARA EDITAR
        //Función que permite obtener los datos directamente de la tabla
        ObtenerDatos(){
            const index = this.productos.findIndex(item => item.codigoBarra == this.codigoBarra);
            var data = this.productos[index]
            this.producto = data.nomProducto
            this.marca = data.marca
            this.descripcion = data.descripcion
            this.nomBodegaEditar = data.nomBodega
            this.stockCriticoEditar = data.stockCritico
            this.stockBodegaEditar = data.stockBodega
            if(data.stockCritico > data.stockBodega){
                this.alerta('danger', 'El stock critico es superior al stock actual en la bodega ' + data.nomBodega)
            }
        },
        //Editar un producto 
        EditarProducto(){
            this.$v.$touch()
            if(!this.$v.producto.$invalid && !this.$v.marca.$invalid && !this.$v.descripcion.$invalid){
                this.axios.put(`api/editarProducto/${this.codigoBarra}`, {nomProducto: this.producto, marca: this.marca, descripcion: this.descripcion})
                    .then(res => {
                    if(!res.data.sqlMessage){
                        this.EditarStockCritico();
                    }else{
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha actualizado el producto',
                        footer: 'Dato repetido asegurese de que el codigo o nombre no existan'
                        })
                    }
                    })
                    .catch(e => {
                    this.alerta('danger', 'No se ha logrado editar al producto');
                })
            }else{
                this.alerta('danger', 'Rellene todos los campos para editar el Producto')
            }
        },
        //EDITAR EL STOCK CRITICO
        EditarStockCritico(){
            this.axios.put(`api/editarstockCritico/${this.codigoBarra}`, {stockCritico: this.stockCriticoEditar})
                .then(res => {
                if(!res.data.sqlMessage){
                    Swal.fire(
                    'Se ha editado al producto satisfactoriamente',
                    'Seleccione Ok para continuar',
                    'success'
                    )
                }else{
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se ha actualizado el producto',
                    footer: 'Dato repetido asegurese de que el codigo o nombre no existan'
                    })
                }
                })
                .catch(e => {
                this.alerta('danger', 'No se ha logrado editar al producto');
            })
        },
        //CARGAR DATOS DE TABLA HISTORIAL
        cargarHistorial(){
            this.axios.get(`api/obtenerHistorialesProducto/${this.codigoBarra}`)
            .then(res => {
                this.historial = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar el historial');
            })
        },
        //Caragar tabla de Detalles de un Historial
        cargarOrdenes(){
            this.axios.get(`api/obtenerOrdenesProducto/${this.codigoBarra}`)
            .then(res => {
                this.ordenes = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar la orden');
            })
        },
        //Cargar los detalles de un historial
        cargarDetalleHistorial(){
            this.axios.get(`api/obtenerHistorial/${this.histo}`)
            .then(res => {
                this.detalleHist = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar el detalle del historial');
            })
        },
        //Cargar los detalles de una orden
        cargarDetalleOrden(){
            this.axios.get(`api/obtenerOrden/${this.histo}`)
            .then(res => {
                this.detalleOrden = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar el detalle de una orden');
            })
        },
        //Al cambiar el input del stock critico evitar que sea menos que 1 y alertar si es inferior al stock de bodega
        cantMinCriticoEditar(){
            if(this.stockCriticoEditar < 1){
                this.stockCriticoEditar = 1;
            }
            if(this.stockCriticoEditar > this.stockBodegaEditar){
                this.alerta('danger', 'El stock critico que esta ingresando es superior al stock actual')
            }
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
      await $('#historial').DataTable()
      await $('#detalleHist').DataTable()
      await $('#ordenes').DataTable()
      await $('#detalleOrden').DataTable()
    },
    watch: {
      productos(val) {
        if(this.pestaña === 'productos'){
          $('#productos').DataTable().destroy();
          this.$nextTick(()=> {
            $('#productos').DataTable()
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
      },
      detalleHist(val) {
        if(this.pestaña === 'detalleHist'){
          $('#detalleHist').DataTable().destroy();
          this.$nextTick(()=> {
            $('#detalleHist').DataTable()
          });
        }
      },
      ordenes(val) {
        if(this.pestaña === 'ordenes'){
          $('#ordenes').DataTable().destroy();
          this.$nextTick(()=> {
            $('#ordenes').DataTable()
          });
        }
      },
      detalleOrden(val) {
        if(this.pestaña === 'detalleOrden'){
          $('#detalleOrden').DataTable().destroy();
          this.$nextTick(()=> {
            $('#detalleOrden').DataTable()
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