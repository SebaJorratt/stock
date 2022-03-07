<template>
    <div class="menu">
        <navbar />
        <transition name="slide-fade">
            <b-container><br>
                <h1 class="mt-2">Entrega de Insumos</h1>
                <b-alert
                :show="dismissCountDown"
                dismissible
                :variant="mensaje.color"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
                >
                {{mensaje.texto}}
                </b-alert>
                <div class=" card mt-4">
                    <div class="card-header">
                        <h2>Determine que productos serán enviados a la Dependencia</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <select class="form-control" v-model="$v.dependencia.$model">
                                    <option v-for="i in dependencias" :key="i.nomDependencia" :value="i.nomDependencia">{{i.nomDependencia}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Funcionario</label>
                                <select class="form-control" v-model="funcionario">
                                    <option v-for="i in funcionarios" :key="i.nomFuncionario" :value="i.nomFuncionario">{{i.nomFuncionario}}</option>
                                </select>
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
                                <select class="form-control" @click="anterior(i.nomProducto)" @change="cambioProducto(i.nomProducto, i.key)" v-model="i.nomProducto">
                                    <option v-for="i in prods" :key="i.nomProducto" :value="i.nomProducto">{{i.nomProducto}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Cantidad ha agregar</label>
                                <input type="number" @change="cantMin(i.key)" min="1" class="form-control" aria-describedby="emailHelp" v-model="i.cantidad">
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Stock Actual</label>
                                <input disabled type="number" class="form-control" aria-describedby="emailHelp" v-model="i.stock">
                            </b-col>
                            <b-col cols="12" md="2">
                                <b-button @click="detalles(i.codigoBarra)" v-b-modal.modal-1 class="btn-success boton">Detalles Producto</b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-button @click="generarInforme()" class="btn-success btn boton mt-5">Generar Informe</b-button>
                        </b-row>
                    </div>
                </div>
                <b-modal id="modal-1" title="Detalles del Producto">
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
            </b-container>
        </transition>
    </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import { required, minLength} from "vuelidate/lib/validators";
export default {
    name: "insumos",
    components: {
        navbar,
    },
     data() {
      return {
        //Datos para agregar un nuevo memo (historial) con v-model
        cantidadProductos: 1,
        productos: [{key: 1, nomProducto: '', cantidad: 0, stock: 0, codigoBarra: ''}],
        prods: [],
        productoAnt: '',
        //Variable para las dependencias 
        dependencias: [],
        dependencia: '',
        //Variables para indicar al funcionario
        funcionarios: [],
        funcionario: '',
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''},
        //VARIABLES DE DETALLES
        codigo: '',
        producto: '',
        marca: '',
        descripcion: '',
      }
    },
    validations:{
      //Validaciones de los input
      dependencia: {required}
    },
    created(){
        this.cargarProductos(true);
        this.cargarDependencias();
        this.cargarFuncionarios();
    },
    methods:{
        //Metodo que Carga todos los productos del sistema
        cargarProductos(primera){
            this.axios.get('api/obtenerProductosSolos')
            .then(res => {
                this.prods = res.data;
                if(primera){
                    this.productos[0].nomProducto = this.prods[0].nomProducto
                    this.productos[0].stock = this.prods[0].stock
                    this.productos[0].codigoBarra = this.prods[0].codigoBarra
                }
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar los Productos');
            })
        },
        //Función que se encargar de cargar las dependencias
        cargarDependencias(){
            this.axios.get('api/obtenerDependencias')
            .then(res => {
                this.dependencias = res.data;
                this.dependencia = this.dependencias[0].nomDependencia;
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar las Dependencias');
            })
        },
        //Función que se encargar de cargar las dependencias
        cargarFuncionarios(){
            this.axios.get('api/obtenerFuncionarios')
            .then(res => {
                this.funcionarios = res.data;
                this.funcionario = this.funcionarios[0].nomFuncionario;
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar los Funcionarios');
            })
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
                    if(this.productos[i].nomProducto === this.productos[indexActual].nomProducto){
                        repetido = true;
                    }
                }
            }
            if(!repetido){
                const index = this.prods.findIndex(item => item.nomProducto == nomProducto);
                const index2 = this.productos.findIndex(item => item.key == key);
                this.productos[index2].stock = this.prods[index].stock
                this.productos[index2].codigoBarra = this.prods[index].codigoBarra
                if(this.productos[index2].cantidad > this.productos[index2].stock){
                    this.productos[index2].cantidad = this.productos[index2].stock;
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
            //Busca si un producto ya existe en en alguno de los select habilitados 
            while(a < this.prods.length){
                const index = this.productos.findIndex(item => item.nomProducto == this.prods[a].nomProducto);
                //Si lo encuentra pasa al siguiente producto
                if(index != -1){
                    a++;
                }else{ //Si el valor retornado es -1 significa que el producto ya existe, por lo tanto debe seguir buscando
                    this.productos[this.productos.length-1].nomProducto = this.prods[a].nomProducto
                    this.productos[this.productos.length-1].stock = this.prods[a].stock
                    this.productos[this.productos.length-1].codigoBarra = this.prods[a].codigoBarra
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
            if(this.productos[index].cantidad < 1){
                this.productos[index].cantidad = 1;
            } else if(this.productos[index].cantidad > this.productos[index].stock){
                this.productos[index].cantidad = this.productos[index].stock;
            }
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
            var sumaStock = 0;
            var suma = 0;
            for(var i = 0; i < this.productos.length; i++){
                sumaStock = sumaStock + this.productos[i].stock
                suma = suma + this.productos[i].cantidad
            }
            swal.fire({
            title: '¿Seguro que desea realizar la entregsa de Insumos ' + this.dueño + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: '¡Si!'
            }).then((result) => {
                if (result.value) {
                    if(sumaStock > 0 && suma > 0 ){
                        this.axios.post('api/agregaHistorial', {fecha: dt, nomFuncionario: this.funcionario, nomDependencia: this.dependencia})
                        .then(res => {
                        if(!res.data.sqlMessage){
                            this.HistorialProducto();
                            this.restarStock();
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
                            text: 'No se ha logrado registrar la entrega de insumos',
                            footer: 'Posible error del sistema'
                        })
                        }) 
                    }else if(sumaStock < 0){
                        this.alerta('danger', 'No se encuentra stock disponible')
                    }else{
                        this.alerta('danger', 'No se ha ingresado ninguna cantidad')
                    }
                }
            })
        },
        //Registra los productos de esta ENTREGA DE INSUMOS 
        HistorialProducto(){
            for(var i = 0; i<this.productos.length; i++){
                if(this.productos[i].cantidad > 0){
                    this.axios.post('api/agregahistProd', {cantidad: this.productos[i].cantidad, codigoBarra: this.productos[i].codigoBarra})
                        .then(res => {
                        if(!res.data.sqlMessage){
                            Swal.fire(
                            'Se ha registrado la entrega de insumos correctamente',
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
                            text: 'No se ha logrado registrar la entrega de insumos',
                            footer: 'Posible error del sistema'
                        })
                        })
                }
            }
        },
        //Resta los stock de cada producto
        restarStock(){
            for(var i = 0; i<this.productos.length; i++){
                if(this.productos[i].cantidad > 0){
                    this.axios.put(`api/actualizaStock/${this.productos[i].codigoBarra}`, {cantidad: this.productos[i].cantidad})
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
        //Actualiza la pagina tras generar una entrega de insumos
        actualizarStock(){
            for(var i = 0; i<this.productos.length-1; i++){
                this.cantidadProductos--;
                this.productos.splice(-1);
            }
            this.cargarProductos(true);
        },
        //Permite ver los detalles de un producto y los carga
        detalles(id){
            this.axios.get(`api/obtenerProducto/${id}`)
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
        //Funciones de la alerta
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

    /* Las animaciones de entrada y salida pueden usar */
    /* funciones de espera y duración diferentes.      */
    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
    }
</style>