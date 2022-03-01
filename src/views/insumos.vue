<template>
    <div class="menu">
        <navbar />
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
                            <select class="form-control">
                                <option disabled value="">Seleccione un estado posible</option>
                                <option>Bueno</option>
                                <option>Regular</option>
                                <option>Malo</option>
                                <option>Baja</option>
                            </select>
                        </b-col>
                        <b-col cols="12" md="4">
                            <label for="exampleInputEmail1" class="form-label">Funcionario</label>
                            <select class="form-control">
                                <option disabled value="">Seleccione un estado posible</option>
                                <option>Bueno</option>
                                <option>Regular</option>
                                <option>Malo</option>
                                <option>Baja</option>
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
                            <select class="form-control" @change="cambioProducto(i.nomproducto, i.key)" v-model="i.nomproducto">
                                <option v-for="i in prods" :key="i.nomproducto" :value="i.nomproducto">{{i.nomproducto}}</option>
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
                        <b-button @click="generarInforme()" class="btn-success btn boton mt-5">Generar Informe</b-button>
                    </b-row>
                </div>
            </div>
        </b-container>
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
        productos: [{key: this.cantidadProductos, nomproducto: '', cantidad: 1, stock: 0}],
        prods: [],
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
      //Validaciones de los input
      
    },
    created(){
        this.cargarProductos();
    },
    methods:{
        //Metodo que Carga todos los productos del sistema
        cargarProductos(){
            this.prods = [{nomproducto: 'Bueno', stock: 20}, {nomproducto: 'Regular', stock: 10}, {nomproducto: 'Malo', stock: 5}]
            this.productos[0].nomproducto = this.prods[0].nomproducto
            this.productos[0].stock = this.prods[0].stock
        },
        //Si se cambia un producto se debe buscar su stock
        cambioProducto(nomproducto, key){
            const index = this.prods.findIndex(item => item.nomproducto == nomproducto);
            const index2 = this.productos.findIndex(item => item.key == key);
            console.log(index, index2)
            this.productos[index2].stock = this.prods[index].stock
        },
        //Se agrega un nuevo posible producto
        agregaProducto(){
            this.cantidadProductos++
            this.productos.push({key: this.cantidadProductos, nomproducto: '', cantidad: 1, stock: 0});
            this.productos[this.productos.length-1].nomproducto = this.prods[0].nomproducto
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
        HistorialProducto(){

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