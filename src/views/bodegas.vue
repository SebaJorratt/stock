<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Bodegas</h1>
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
                <b-row v-if="pestaña === 'bodegas'">
                    <b-col cols="12" md="6">
                        <b-button @click="ActCrear()" class="btn-success btn boton mt-5">Rellenar Bodega</b-button>
                    </b-col>
                    <b-col cols="12" md="6" v-if="agregar === 'no'">
                        <b-button @click="ActAgregar()" variant="primary" class="btn boton mt-5">Agregar Bodega</b-button>
                    </b-col>
                    <b-col cols="12" md="6" v-if="agregar === 'si'">
                        <b-button @click="NoAgregar()" class="btn boton mt-5">No Agregar</b-button>
                    </b-col>
                </b-row>
                <b-row class="m-4" v-if="agregar === 'si'">
                    <b-col cols="12" md="6">
                        <label for="exampleInputEmail1" class="form-label">Nueva Bodega</label>
                        <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nuevaBodega.$model">
                        <p class="text-danger" v-if="$v.nuevaBodega.$error">Debe Ingresar el nombre de la Bodega</p>
                    </b-col>
                    <b-col cols="12" md="6">
                        <b-button @click="agregaBodega()" variant="primary" class="btn boton mt-5">Agregar Bodega</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="bodegas" v-if="pestaña === 'bodegas'">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Codigo de Barras</th>
                      <th scope="col">Marca</th>
                      <th scope="col">Stock DirecReg</th>
                      <th scope="col">Stock Bodegas</th>
                      <th scope="col">Ordenes de Compra</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in bodegas" :key="i.codigoBarra">
                      <td scope="row">{{i.producto}}</td>
                      <td>{{i.codigoBarra}}</td>
                      <td>{{i.marca}}</td>
                      <td>{{i.stock}}</td>
                      <td>{{i.stockbodega}}</td>
                      <td><b-button @click="ActOrdenes(i.codigoBarra)" class="btn-success btn-sm" style="border-color: white;">Ordenes</b-button></td>
                    </tr>
                  </tbody>
                </table>
                <b-button @click="Volver()" class="btn boton mt-5" v-if="pestaña === 'crear'">Volver al Listado de Bodegas</b-button>
                <div class=" card mt-4" v-if="pestaña === 'crear'">
                    <div class="card-header">
                        <h2>Determine que productos serán enviados a la Bodega</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Bodega</label>
                                <select class="form-control" v-model="bodegaCrear">
                                    <option disabled value="">Seleccione un estado posible</option>
                                    <option>Bueno</option>
                                    <option>Regular</option>
                                    <option>Malo</option>
                                    <option>Baja</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="2">
                                <label for="exampleInputEmail1" class="form-label">Proveedor</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.proveedor.$model">
                                <p class="text-danger" v-if="$v.proveedor.$error">Debe Ingresar el proveedor</p>
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Numero de Orden</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nuevaOrden.$model">
                                <p class="text-danger" v-if="$v.nuevaOrden.$error">Debe Ingresar el numero de la Orden</p>
                            </b-col>
                            <b-col cols="12" md="2">
                                <b-button @click="agregaProducto()" variant="primary" class="btn-primary btn boton">Agregar Producto</b-button>
                            </b-col>
                            <b-col cols="12" md="2">
                                <b-button @click="quitarProducto()" class="btn-danger btn boton">Quitar Producto</b-button>
                            </b-col>
                        </b-row>
                        <b-row class="mt-2" v-for="i in productos" :key="i.key">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Producto</label>
                                <select class="form-control" @change="cambioProducto(i.producto, i.key)" v-model="i.producto">
                                    <option v-for="i in prods" :key="i.producto" :value="i.producto">{{i.producto}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Cantidad ha agregar</label>
                                <input type="number" @change="cantMin(i.cantidad)" min="1" class="form-control" aria-describedby="emailHelp" v-model="i.cantidad">
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Stock Actual</label>
                                <input disabled type="number" class="form-control" aria-describedby="emailHelp" v-model="i.stock">
                            </b-col>
                            <b-col cols="12" md="2">
                                <b-button class="btn-success boton">Detalles Producto</b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" md="6">
                                <b-button @click="generarInforme()" class="btn-success btn boton mt-5">Generar Orden de Compra</b-button>
                            </b-col> 
                            <b-col cols="12" md="6">
                                <b-button @click="generar()" class="btn-success btn boton mt-5">Compra en Caja Menor</b-button>
                            </b-col> 
                        </b-row>
                    </div>
                </div>
                <b-row v-if="pestaña === 'ordenes'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver a Funcionarios</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="historial" v-if="pestaña === 'ordenes'">
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
                      <td>{{i.bodega}}</td>
                      <td>{{i.proveedor}}</td>
                      <td>{{i.fecha}}</td>
                      <td><b-button @click="ActOrdenes(i.codOrden)" class="btn-success btn-sm" style="border-color: white;">Detalles</b-button></td>
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
        pestaña: 'bodegas',
        agregar: 'no',
        bodegas: [],
        ordenes: [],
        //Variables del AGREGAR
        nuevaBodega: '',
        //Variable para reconocer un producto
        codFuncionario: '',
        //Datos para agregar una nueva Orden de Compra con v-model
        bodegaCrear: '',
        proveedor: '',
        nuevaOrden: '',
        cantidadProductos: 1,
        productos: [{key: this.cantidadProductos, producto: '', cantidad: 1, stock: 0}],
        prods: [],
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
        //Validaciones de los input
        nuevaBodega:{required},
        proveedor:{required},
        nuevaOrden:{required},
    },
    created(){
        this.cargarBodegas();
    },
    methods:{
        //Función para cargar las bodegas del sistema
        cargarBodegas(){
            this.bodegas = [{producto: 'Bueno', codigoBarra: '8797828291', marca: 'XD', descripcion: 'Buen producto', stock: 20, stockbodega: 40}, {producto: 'Regular', codigoBarra: '879782asd8291', marca: 'XDD', descripcion: 'no tan bueno producto', stock: 25, stockbodega: 42}]
        },
        //Función para regresar a la vista principal
        Volver(){
            this.pestaña = 'bodegas'
            $('#bodegas').DataTable()
            this.cargarBodegas();
        },
        //Funciones para cambiar las vistas
        ActAgregar(){
            this.agregar = 'si'
        },
        NoAgregar(){
            this.agregar = 'no'
        },
        ActOrdenes(codigoBarra){
            this.codigoBarra = codigoBarra
            this.pestaña = 'ordenes'
            $('#bodegas').DataTable().destroy();
            this.cargarOrdenes();
        },
        ActCrear(){
            this.pestaña = 'crear'
            this.agregar = 'no'
            $('#bodegas').DataTable().destroy();
            this.cargarProductos();
        },
        //Funciones para Rellenar una BODEGA
        //Función que carga todos los productos del sistema
        cargarProductos(){
            this.prods = [{producto: 'Bueno', stock: 20}, {producto: 'Regular', stock: 10}, {producto: 'Malo', stock: 5}]
            this.productos[0].producto = this.prods[0].producto
            this.productos[0].stock = this.prods[0].stock
        },
        //Si se cambia un producto se debe buscar su stock
        cambioProducto(producto, key){
            const index = this.prods.findIndex(item => item.producto == producto);
            const index2 = this.productos.findIndex(item => item.key == key);
            console.log(index, index2)
            this.productos[index2].stock = this.prods[index].stock
        },
        //Se agrega un nuevo posible producto
        agregaProducto(){
            this.cantidadProductos++
            this.productos.push({key: this.cantidadProductos, producto: '', cantidad: 1, stock: 0});
            this.productos[this.productos.length-1].producto = this.prods[0].producto
            this.productos[this.productos.length-1].stock = this.prods[0].stock
        },
        //Se quita un Producto de los que serán agregados al sistema
        quitarProducto(){
            if(this.productos.length > 1){
                this.cantidadProductos--;
                this.productos.splice(-1);
            }else{
                this.alerta('danger', 'Tiene que existir al menos 1 producto');
            }
        },
        //Indicamos el minimo de cantidad para que no este vacio o sea menor a 0
        cantMin(cantidad){
            const index = this.productos.findIndex(item => item.cantidad == cantidad);
            if(cantidad < 1){
                this.productos[index].cantidad = 1;
            }
        },
        generarInforme(){

        },
        generar(){

        },
        //Funciones de AGREGAR
        agregaBodega(){
            console.log('Agregar')
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
      await $('#bodegas').DataTable()
    },
    watch: {
      bodegas(val) {
        if(this.pestaña === 'bodegas'){
          $('#bodegas').DataTable().destroy();
          this.$nextTick(()=> {
            $('#bodegas').DataTable()
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