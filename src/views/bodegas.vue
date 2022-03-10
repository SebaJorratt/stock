<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Bodegas</h1>
            <h2 class="mt-1" v-if="pestaña === 'bodegas'"> Listado de Bodegas</h2>
            <h2 class="mt-1" v-if="pestaña === 'ordenes'"> Listado de Ordenes de la Bodega: {{nomBodega}}</h2>
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
                      <th scope="col">Nombre de la Bodega</th>
                      <th scope="col">Enviar a Dirección</th>
                      <th scope="col">Ordenes de Compra</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in bodegas" :key="i.nomBodega">
                      <td scope="row">{{i.nomBodega}}</td>
                      <td><b-button @click="ActProductos(i.nomBodega)" class="btn-warning btn-sm" style="border-color: white;">Enviar</b-button></td>
                      <td><b-button @click="ActOrdenes(i.nomBodega)" class="btn-success btn-sm" style="border-color: white;">Ordenes</b-button></td>
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
                                <select @change="cambiaBodega()" class="form-control" v-model="bodegaCrear">
                                    <option v-for="i in bodegas" :key="i.nomBodega" :value="i.nomBodega">{{i.nomBodega}}</option>
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
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Codigo de Barra</label>
                                <input type="text" @input="buscarPorCodigo(i.codigoBarra, i.key, i.nomProducto)" class="form-control" aria-describedby="emailHelp" v-model="i.codigoBarra"> 
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Producto</label>
                                <select class="form-control" @click="anterior(i.nomProducto)" @change="cambioProducto(i.nomProducto, i.key)" v-model="i.nomProducto">
                                    <option v-for="i in prods" :key="i.nomProducto" :value="i.nomProducto">{{i.nomProducto}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="1">
                                <label for="exampleInputEmail1" class="form-label">Cantidad</label>
                                <input type="number" @change="cantMin(i.key)" min="1" class="form-control" aria-describedby="emailHelp" v-model="i.cantidad">
                            </b-col>
                            <b-col cols="12" md="2">
                                <label for="exampleInputEmail1" class="form-label">Stock en Bodega</label>
                                <input disabled type="number" class="form-control" aria-describedby="emailHelp" v-model="i.stock">
                            </b-col>
                            <b-col cols="12" md="1">
                                <label for="exampleInputEmail1" class="form-label">Critico</label>
                                <input disabled type="number" class="form-control" aria-describedby="emailHelp" v-model="i.stockCritico">
                            </b-col>
                            <b-col cols="12" md="2">
                                <b-button @click="detalles(i.codBar)" v-b-modal.modal-1 class="btn-success boton">Detalles Producto</b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" md="6">
                                <b-button @click="generarInforme()" class="btn-success btn boton mt-5">Generar Orden de Compra</b-button>
                            </b-col> 
                            <b-col cols="12" md="6">
                                <b-button @click="sumaStock()" class="btn-success btn boton mt-5">Compra en Caja Menor</b-button>
                            </b-col> 
                        </b-row>
                    </div>
                </div>
                <b-modal id="modal-1" size="lg" title="Detalles del Producto">
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Codigo de Barras</label>
                                <input disabled type="text" class="form-control" aria-describedby="emailHelp" v-model="codigo">
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Nombre</label>
                                <input disabled type="text" class="form-control" aria-describedby="emailHelp" v-model="producto">
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Marca</label>
                                <input disabled type="text" class="form-control" aria-describedby="emailHelp" v-model="marca">
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="12">
                                <label for="exampleInputEmail1" class="form-label">Descripcion</label>
                                <textarea disabled type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="descripcion"></textarea>
                            </b-col>
                        </b-row>
                    </div>
                </b-modal>

                <b-row v-if="pestaña === 'ordenes'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver al Listado de Bodegas</b-button>
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

                <b-row v-if="pestaña === 'enviar'">
                    <b-col cols="12" md="12">
                        <b-button @click="Volver()" class="btn btn boton mt-5">Volver al Listado de Bodegas</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="enviar" v-if="pestaña === 'enviar'">
                  <thead>
                    <tr>
                      <th scope="col">Codigo Barra</th>
                      <th scope="col">Nombre Producto</th>
                      <th scope="col">Stock Regional</th>
                      <th scope="col">Stock Bodega</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Stock Critico</th>
                      <th scope="col">Enviar a Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in enviar" :key="i.codigoBarra">
                      <td scope="row">{{i.codigoBarra}}</td>
                      <td>{{i.nomProducto}}</td>
                      <td>{{i.stock}}</td>
                      <td>{{i.stockBodega}}</td>
                      <td><input type="number" @change="cantMinBodega(i.codigoBarra)" min="1" class="form-control" aria-describedby="emailHelp" v-model="i.cantidad"></td>
                      <td>{{i.stockCritico}}</td>
                      <td><b-button @click="EnviarDireccion(i.codigoBarra, i.cantidad, i.stockBodega)" class="btn-success btn-sm" style="border-color: white;">Enviar</b-button></td>
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
        pestaña: 'bodegas',
        agregar: 'no',
        bodegas: [],
        ordenes: [],
        detalleOrden: [],
        enviar: [],
        //Variables del AGREGAR
        nuevaBodega: '',
        //Variable para reconocer una bodega
        nomBodega: '',
        //Datos para agregar una nueva Orden de Compra con v-model
        bodegaCrear: '',
        proveedor: '',
        nuevaOrden: '',
        cantidadProductos: 1,
        productos: [{key: 1, nomProducto: '', cantidad: 0, stock: 0, stockCritico: 0, codigoBarra: '', codBar: ''}],
        prods: [],
        productoAnt: '',
        //VARIABLES DE DETALLES
        codigo: '',
        producto: '',
        marca: '',
        descripcion: '',
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''},
      }
    },
    validations:{
        //Validaciones de los input
        nuevaBodega:{required},
        proveedor:{required},
        nuevaOrden:{required},
    },
    computed: {
      ...mapState(['token', 'usuarioDB'])
    },
    created(){
        this.cargarBodegas();
    },
    methods:{
        //METODOS PARA GENERAR LAS ORDENES DE COMPRA
        //Metodo que Carga todos los productos del sistema
        cargarProductos(primera){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerProductosBodega/${this.bodegaCrear}`, config)
            .then(res => {
                this.prods = res.data;
                if(primera){
                    this.productos[0].nomProducto = this.prods[0].nomProducto
                    this.productos[0].stock = this.prods[0].stockBodega
                    this.productos[0].stockCritico = this.prods[0].stockCritico
                    this.productos[0].codigoBarra = this.prods[0].codigoBarra
                    this.productos[0].codBar = this.prods[0].codigoBarra
                    if(this.productos[0].stock < this.productos[0].stockCritico){
                        if(this.productos[0].stock === 0){
                            this.alerta('danger', 'No hay stock disponible en bodega para el producto ' + this.productos[0].nomProducto)
                        }
                    }
                }
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar los Productos');
            })
        },
        //Función que carga los productos de una bodega para trasferir productos a Dirección Regional
        cargarProductosBodega(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerProductosBodega/${this.nomBodega}`, config)
            .then(res => {
                for(var i = 0; i<res.data.length; i++){
                    this.enviar.push({codigoBarra: res.data[i].codigoBarra, nomProducto: res.data[i].nomProducto, stock: res.data[i].stock, stockBodega: res.data[i].stockBodega, cantidad: 1, stockCritico: res.data[i].stockCritico})
                }
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar los Productos');
            })
        },
        //Función que permite re-cargar los productos al momento de cambiar la bodega en la vista de rellenar Bodega
        cambiaBodega(){
            for(var i = 0; i<this.productos.length-1; i++){
                this.productos.splice(-1)
            }
            this.cargarProductos(true)
        },
        buscarPorCodigo(codigoBarra, key, nomProducto){
            this.anterior(nomProducto)
            const indexActual = this.productos.findIndex(item => item.key == key);
            const posProd = this.prods.findIndex(item => item.codigoBarra == codigoBarra)
            if(posProd !== -1){
                this.cambioProducto(this.prods[posProd].nomProducto, key)
            }else{
                this.productos[indexActual].nomProducto = this.productoAnt
            }
        },
        //Función que te permite guardar el valor anterior del select
        anterior(nomProducto){
            this.productoAnt = nomProducto
        },
        //Si se cambia un producto se debe buscar su stock
        cambioProducto(nomProducto, key){
            const indexActual = this.productos.findIndex(item => item.key == key);
            var repetido = false;
            for(var i = 0; i<this.productos.length; i++){
                if(i != indexActual){
                    if(this.productos[i].nomProducto === nomProducto){
                        repetido = true;
                    }
                }
            }
            if(!repetido){
                const index = this.prods.findIndex(item => item.nomProducto == nomProducto);
                const index2 = this.productos.findIndex(item => item.key == key);
                this.productos[index2].stock = this.prods[index].stockBodega
                this.productos[index2].stockCritico = this.prods[index].stockCritico
                this.productos[index2].nomProducto = this.prods[index].nomProducto;
                this.productos[index2].codigoBarra = this.prods[index].codigoBarra
                this.productos[index2].codBar = this.prods[index].codigoBarra
                if(this.productos[index2].cantidad > this.productos[index2].stock){
                    this.productos[index2].cantidad = this.productos[index2].stock;
                }
                if(this.productos[index2].stock + this.productos[index2].cantidad < this.productos[index2].stockCritico){
                    if(this.productos[index2].stock){
                        this.alerta('danger', 'El existe stock en bodega para el producto ' + this.productos[index2].nomProducto)
                    }
                    this.alerta('danger', 'El stock que existe actualmente en bodega del producto "' + this.productos[index2].nomProducto + '" es inferior al stock crítico')
                }
            }else{
                this.productos[indexActual].nomProducto = this.productoAnt  
            }
        },
        //Se agrega un nuevo posible producto
        //ADEMAS debe revisar si los valores anteriores estan repetidos
        agregaProducto(){
            this.cantidadProductos++
            var a = 0;
            this.productos.push({key: this.cantidadProductos, nomProducto: '', cantidad: 0, stock: 0});
            while(a < this.prods.length){
                const index = this.productos.findIndex(item => item.nomProducto == this.prods[a].nomProducto);
                if(index != -1){
                    a++;
                }else{
                    this.productos[this.productos.length-1].nomProducto = this.prods[a].nomProducto
                    this.productos[this.productos.length-1].stock = this.prods[a].stockBodega
                    this.productos[this.productos.length-1].stockCritico = this.prods[a].stockCritico
                    this.productos[this.productos.length-1].codigoBarra = this.prods[a].codigoBarra
                    this.productos[this.productos.length-1].codBar = this.prods[a].codigoBarra
                    this.productos[this.productos.length-1].key = this.cantidadProductos
                    break;
                }
                if(a == this.prods.length){
                    this.cantidadProductos--;
                    this.productos.splice(-1);
                    this.alerta('danger','No existen mas productos para agregar')
                    break;
                }
            } 
            if(this.productos[this.productos.length-1].stock < this.productos[this.productos.length-1].stockCritico && a != this.prods.length){
                this.alerta('danger', 'El stock que existe actualmente en bodega del producto "' + this.productos[this.productos.length-1].nomProducto + '" es inferior al stock crítico')
            }
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
        cantMin(producto){
            const index = this.productos.findIndex(item => item.key == producto);
            if(this.productos[index].cantidad < 0 || this.productos[index].cantidad == ''){
                this.productos[index].cantidad = 0;
            }
            if(this.productos[index].stock + parseInt(this.productos[index].cantidad) < this.productos[index].stockCritico){
                this.alerta('danger', 'El stock que existe actualmente en bodega del producto "' + this.productos[index].nomProducto + '" es inferior al stock crítico ingrese mas cantidad para cumplir con el stock Crítico')
            }
        },
        //Indicamos el minimo de cantidad para que no este vacio o sea menor a 0
        cantMinBodega(producto){
            const index = this.enviar.findIndex(item => item.codigoBarra == producto);
            if(this.enviar[index].cantidad < 0){
                this.enviar[index].cantidad = 0;
            }
            if(this.enviar[index].stockBodega - parseInt(this.enviar[index].cantidad) < this.enviar[index].stockCritico){
                this.alerta('danger', 'Si realiza esta acción el stock en bodega del producto "' + this.enviar[index].nomProducto + '" sera inferior al stock crítico')
            }
        },
        //Permite ver los detalles de un producto y los carga
        detalles(id){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerProducto/${id}`, config)
                .then(res => {
                    this.codigo = res.data[0].codigoBarra;
                    this.producto = res.data[0].nomProducto;
                    this.marca = res.data[0].marca;
                    this.descripcion = res.data[0].descripcion
                })
                .catch(e => {
                    Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se ha logrado encontrar los datos del equipo',
                    footer: 'Posible error del sistema'
                    })
                })
        },
        convertDateMysql(yourDate){
            yourDate.toISOString().split('T')[0]
            const offset = yourDate.getTimezoneOffset()
            yourDate = new Date(yourDate.getTime() - (offset*60*1000))
            return yourDate.toISOString().split('T')[0]
		},
        //Función que permite generar un informe y enviar los datos de un nuevo HISTORIAL 
        generarInforme(){
            var dt = this.convertDateMysql(new Date())
            var sumaStockBodega = 0;
            var suma = 0;
            for(var i = 0; i < this.productos.length; i++){
                sumaStockBodega = sumaStockBodega + this.productos[i].stock
                suma = suma + this.productos[i].cantidad
            }
            this.$v.$touch()
            if(!this.$v.nuevaOrden.$invalid && !this.$v.proveedor.$invalid){
                swal.fire({
                title: '¿Seguro que desea realizar la orden de compra a la bodega ' + this.bodegaCrear + '?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: '¡Si!'
                }).then((result) => {
                    if (result.value) {
                        if(sumaStockBodega > 0 && suma > 0){
                            let config = {
                                headers: {
                                    token: this.token
                                }
                            }
                            this.axios.post('api/agregaOrdenEntrega', {codOrden: this.nuevaOrden, proveedor: this.proveedor, fecha: dt, nomBodega: this.bodegaCrear}, config)
                            .then(res => {
                            if(!res.data.sqlMessage){
                                this.ORDENProducto();
                                this.sumaStock();
                            }else{
                                Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se ha logrado crear ',
                                footer: 'Algún dato ha sido incorrecto verifiquelos'
                                })
                            }
                            })
                            .catch(e => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se ha logrado registrar la orden de compra',
                                footer: 'Posible error del sistema'
                            })
                            }) 
                        }else if(sumaStockBodega > 0){
                            this.alerta('danger', 'No se encuentra stock disponible en bodega')
                        }else{
                            this.alerta('danger', 'No se ha ingresado ninguna cantidad')
                        }
                    }
                })
            }else{
                this.alerta('danger', 'Porfavor ingrese todos los campos requeridos')
            }
        },
        //Registra los productos de la ORDEN DE COMPRA
        ORDENProducto(){
            for(var i = 0; i<this.productos.length; i++){
                if(this.productos[i].cantidad > 0){
                    let config = {
                        headers: {
                            token: this.token
                        }
                    }
                    this.axios.post('api/agregaOrdenProducto', {cantidad: this.productos[i].cantidad, codOrden: this.nuevaOrden, codigoBarra: this.productos[i].codBar}, config)
                        .then(res => {
                        if(!res.data.sqlMessage){
                            Swal.fire(
                            'Se ha registrado la orden de compra satisfactoriamente',
                            'Seleccione Ok para continuar',
                            'success'
                            )
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se ha logrado crear ',
                                footer: 'Algún dato ha sido incorrecto verifiquelos'
                            })
                        }
                        })
                        .catch(e => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se ha logrado registrar la orden de compra',
                                footer: 'Posible error del sistema'
                            })
                        })
                }
            }
        },

        //Suma los stock de BODEGA de cada producto
        sumaStock(){
            for(var i = 0; i<this.productos.length; i++){
                if(this.productos[i].cantidad > 0){
                    let config = {
                        headers: {
                            token: this.token
                        }
                    }
                    this.axios.put(`api/actualizaStockBodegamas/${this.productos[i].codBar}`, {cantidad: this.productos[i].cantidad, nomBodega: this.bodegaCrear}, config)
                        .then(res => {
                            this.actualizarStock();
                        })
                        .catch(e => {
                            var mensaje = 'Posible error del sistema';
                            Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se ha logrado registrar la entrega de insumos',
                            footer: mensaje
                            })
                        })
                }
            }
        },
        //Actualiza la pagina tras generar una orden de compra
        actualizarStock(){
            for(var i = 0; i<this.productos.length-1; i++){
                this.cantidadProductos--;
                this.productos.splice(-1);
            }
            this.cargarProductos(true);
        },
        //Función para cargar las bodegas del sistema
        cargarBodegas(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('api/obtenerbodegas', config)
            .then(res => {
                this.bodegas = res.data;
                this.bodegaCrear = res.data[0].nomBodega
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar las bodegas');
            })
        },
        //Función para regresar a la vista principal
        Volver(){
            this.pestaña = 'bodegas'
            $('#ordenes').DataTable().destroy()
            $('#enviar').DataTable().destroy()
            this.enviar = []
            $('#bodegas').DataTable()
            this.cargarBodegas();
        },
        VolverORD(){
            $('#detalleOrden').DataTable().destroy();
            this.pestaña = 'ordenes'
            this.cargarOrdenes();
            $('#ordenes').DataTable()
        },
        //Funciones para cambiar las vistas
        ActAgregar(){
            this.agregar = 'si'
        },
        NoAgregar(){
            this.agregar = 'no'
        },
        
        ActOrdenes(nomBodega){
            this.nomBodega = nomBodega
            this.pestaña = 'ordenes'
            $('#bodegas').DataTable().destroy();
            $('#ordenes').DataTable()
            this.cargarOrdenes();
        },
        ActDOrdenes(codOrden){
            this.histo = codOrden;
            this.pestaña = 'detalleOrden';
            $('#ordenes').DataTable().destroy();
            $('#detalleOrden').DataTable()
            this.cargarDetalleOrden();
        },
        ActCrear(){
            this.pestaña = 'crear'
            this.agregar = 'no'
            $('#bodegas').DataTable().destroy();
            this.cargarProductos(true);
        },
        ActProductos(nomBodega){
            this.nomBodega = nomBodega
            this.pestaña = 'enviar'
            $('#bodegas').DataTable().destroy();
            $('#enviar').DataTable()
            this.cargarProductosBodega();
        },
        //Funciones de AGREGAR
        agregaBodega(){
            this.$v.$touch()
            if(!this.$v.nuevaBodega.$invalid){
                let config = {
                    headers: {
                        token: this.token
                    }
                }
                this.axios.post('api/agregaBodega', {nomBodega: this.nuevaBodega}, config)
                    .then(res => {
                        if(!res.data.sqlMessage){
                            this.bodegas.push({nomBodega: this.nuevaBodega})
                            Swal.fire(
                            'Se ha registrado la bodega satisfactoriamente',
                            'Seleccione Ok para continuar',
                            'success'
                            )
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se ha logrado crear la nueva bodega "' + this.nuevaBodega + '" .',
                                footer: 'El nombre de la bodega ya existe en el sistema'
                            })
                        }
                        })
                        .catch(e => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'No se ha logrado registrar la nueva bodega',
                                footer: 'Posible error del sistema'
                            })
                        })
            }else{
                this.alerta('danger', 'Porfavor ingrese un nombre para la nueva bodega')
            }
        },
        //TABLA DE ORDENES QUE POSEE UNA BODEGA
        cargarOrdenes(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerOrdenesBodega/${this.nomBodega}`, config)
            .then(res => {
                this.ordenes = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar la orden');
            })
        },
        //Cargar los detalles de una orden
        cargarDetalleOrden(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get(`api/obtenerOrden/${this.histo}`, config)
            .then(res => {
                this.detalleOrden = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se ha logrado cargar el detalle de una orden');
            })
        },
        //Función que envia un stock desde bodega a Dirección Regional
        EnviarDireccion(codigoBarra, cantidad, stockBodega){
            if(stockBodega > 0){
                swal.fire({
                    title: '¿Seguro que desea enviar el stock de la bodega con una cantidad de "' + cantidad + '" a dirección regional para el producto de codigo: "' + codigoBarra + '"?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: '¡Si!'
                }).then((result) => {
                    if (result.value) {
                        let config = {
                            headers: {
                                token: this.token
                            }
                        }
                        this.axios.put(`api/actualizaStockBodega/${codigoBarra}`, {cantidad: parseInt(cantidad), nomBodega: this.nomBodega}, config)
                                .then(res => {
                                    this.recibirDireccion(codigoBarra, cantidad);
                                })
                                .catch(e => {
                                    var mensaje = 'Posible error del sistema';
                                    Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: 'No se ha logrado traspasar los stocks',
                                    footer: mensaje
                                    })
                                })
                    }
                })
            }else{
                this.alerta('danger', 'El stock actual para este producto en la bodega es 0')
            }
        },
        //Función que permite actualizar el stock de un producto en la dirección Regional
        recibirDireccion(codigoBarra, cantidad){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.put(`api/actualizaStockmas/${codigoBarra}`, {cantidad: cantidad}, config)
                    .then(res => {
                        Swal.fire(
                            'Se ha realizado un traspaso de stock a Dirección Regional',
                            'Seleccione Ok para continuar',
                            'success'
                        )
                        this.actualizarStocksProductoBodega(codigoBarra, cantidad)
                    })
                    .catch(e => {
                        var mensaje = 'Posible error del sistema';
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha logrado recibir el stock en dirección regional',
                        footer: mensaje
                        })
                    })
        },
        //Función que actualiza los stock en la vista de la página
        actualizarStocksProductoBodega(codigoBarra, cantidad){
            const index = this.enviar.findIndex(item => item.codigoBarra == codigoBarra);
            this.enviar[index].stockBodega = this.enviar[index].stockBodega - parseInt(cantidad)
            this.enviar[index].stock = this.enviar[index].stock + parseInt(cantidad)
        },
        //Funciones de las alertas
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
      await $('#ordenes').DataTable()
      await $('#detalleOrden').DataTable()
      await $('#enviar').DataTable()
    },
    watch: {
      bodegas(val) {
        if(this.pestaña === 'bodegas'){
          $('#bodegas').DataTable().destroy();
          this.$nextTick(()=> {
            $('#bodegas').DataTable()
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
      },
      enviar(val) {
        if(this.pestaña === 'enviar'){
          $('#enviar').DataTable().destroy();
          this.$nextTick(()=> {
            $('#enviar').DataTable()
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