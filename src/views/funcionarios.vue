<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Administración de Funcionarios</h1>
            <h2 class="mt-1" v-if="pestaña === 'funcionarios'"> Listado de Funcionarios</h2>
            <h2 class="mt-1" v-if="pestaña === 'historial'"> Historial de entrega de insumos del funcionario: {{codFuncionario}}</h2> 
            <h2 class="mt-1" v-if="pestaña === 'detalleHist'"> Detalle del Memo N°: {{memoHist}}</h2>
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
                        <b-button @click="ActAgregar()" class="btn-success btn boton mt-5">Agregar Funcionario</b-button>
                    </b-col>
                </b-row>
                <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="funcionarios" v-if="pestaña === 'funcionarios'">
                  <thead>
                    <tr>
                      <th scope="col">Codigo Funcionario</th>
                      <th scope="col">Funcionario</th>
                      <th scope="col">Correo</th>
                      <th scope="col">Rut</th>
                      <th scope="col">Dependencia</th>
                      <th scope="col">Edición</th>
                      <th scope="col">Historial Entregas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in funcionarios" :key="i.codFuncionario">
                      <td scope="row">{{i.codFuncionario}}</td>
                      <td>{{i.nomFuncionario}}</td>
                      <td>{{i.correo}}</td>
                      <td>{{i.rut}}</td>
                      <td>{{i.nomDependencia}}</td>
                      <td><b-button @click="Acteditar(i.codFuncionario)" class="btn-warning btn-sm" style="border-color: white;">Editar</b-button></td>
                      <td><b-button @click="ActHist(i.codFuncionario)" class="btn btn-sm" style="border-color: white;">Historial</b-button></td>
                    </tr>
                  </tbody>
                </table>
                <br v-if="pestaña === 'funcionarios'"><div class="mb-1">
                    <b-button @click="exportar(1)" v-if="pestaña === 'funcionarios'" class="btn-success boton">Exportar</b-button>
                </div>
                <div class="card mt-5" v-if="pestaña === 'agregar'" style="border-color: black;">
                    <div class="card-header">
                        <h2>Agregar una Funcionario</h2>
                    </div>
                    <div class="card-body">
                        <b-row class="mt-2">
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Codigo de Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.codFuncionarioAgregar.$model">
                                <p class="text-danger" v-if="$v.codFuncionarioAgregar.$error">El codigo del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nomFuncionarioAgregar.$model">
                                <p class="text-danger" v-if="$v.nomFuncionarioAgregar.$error">El nombre del Funcionario es Requerido con un mínimo de 10 caracteres</p>
                            </b-col>
                            <b-col cols="12" md="3">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <select class="form-control" @change="cambiaJardin()" v-model="dependenciaAgregar">
                                    <option v-for="i in dependencias" :key="i.codDependencia" :value="i.nomDependencia">{{i.nomDependencia}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="2">
                                <label for="exampleInputEmail1" class="form-label">Codigo Jardín</label>
                                <input disabled type="text" class="form-control" id="nomFuncionarioAgrega" aria-describedby="emailHelp" v-model="codigoJardinAgregar">
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Correo del Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.correoAgregar.$model">
                                <p class="text-danger" v-if="$v.correoAgregar.$error">El correo del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Encargado de Dependencia</label>
                                <select class="form-control" v-model="encargadoAgregar">
                                <option disabled value="">Tipo de funcionario</option>
                                    <option value="1">Encargado</option>
                                    <option value="0">Normal</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="4">
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
                            <b-col cols="12" md="5">
                                <label for="exampleInputEmail1" class="form-label">Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.nomFuncionario.$model">
                                <p class="text-danger" v-if="$v.nomFuncionario.$error">El nombre del Funcionario es Requerido con 10 caracteres mínimos</p>
                            </b-col>
                            <b-col cols="12" md="5">
                                <label for="exampleInputEmail1" class="form-label">Dependencia</label>
                                <select class="form-control" @change="cambiaJardinEditar()" v-model="dependencia">
                                    <option v-for="i in dependencias" :key="i.codDependencia" :value="i.nomDependencia">{{i.nomDependencia}}</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="2">
                                <label for="exampleInputEmail1" class="form-label">Codigo Jardín</label>
                                <input disabled type="text" class="form-control" id="nomFuncionarioAgrega" aria-describedby="emailHelp" v-model="codigoJardin">
                            </b-col>
                        </b-row>
                        <b-row class="mt-4">
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Correo del Funcionario</label>
                                <input type="text" class="form-control" aria-describedby="emailHelp" v-model="$v.correo.$model">
                                <p class="text-danger" v-if="$v.correo.$error">El correo del Funcionario es Requerido</p>
                            </b-col>
                            <b-col cols="12" md="4">
                                <label for="exampleInputEmail1" class="form-label">Encargado de Dependencia</label>
                                <select class="form-control" v-model="encargado">
                                <option disabled value="">Tipo de funcionario</option>
                                    <option value="1">Encargado</option>
                                    <option value="0">Normal</option>
                                </select>
                            </b-col>
                            <b-col cols="12" md="4">
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
                      <th scope="col">Memo</th>
                      <th scope="col">Funcionario</th>
                      <th scope="col">Dependencia</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Ver al Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in historial" :key="i.corrHistorial">
                      <td scope="row">{{i.memo}}</td>
                      <td>{{i.nomFuncionario}}</td>
                      <td>{{i.nomDependencia}}</td>
                      <td>{{i.fecha}}</td>
                      <td><b-button @click="ActDHist(i.corrHistorial, i.memo)" class="btn-success btn-sm" style="border-color: white;">Detalles</b-button></td>
                    </tr>
                  </tbody>
                </table>
                <br v-if="pestaña === 'historial'"><div class="mb-1">
                    <b-button @click="exportar(2)" v-if="pestaña === 'historial'" class="btn-success boton">Exportar</b-button>
                </div>
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
                <br v-if="pestaña === 'detalleHist'"><div class="mb-1">
                    <b-button @click="exportar(3)" v-if="pestaña === 'detalleHist'" class="btn-success boton">Exportar</b-button>
                </div>
            </div>
        </b-container>
    </div>
</template>

<script>
import navbar from "../components/navbar.vue";
import { required, minLength, email} from "vuelidate/lib/validators";

import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 

import { mapState } from 'vuex'

//EXCEL eXportación
import * as XLSX from 'xlsx/xlsx.mjs';
/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);
/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);

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
        detalleHist: [],
        //Variables del AGREGAR
        codFuncionarioAgregar: '',
        nomFuncionarioAgregar: '',
        dependenciaAgregar: '',
        correoAgregar: '',
        rutAgregar: '',
        encargadoAgregar: 0,
        codigoJardinAgregar: '',
        //Variable para reconocer un producto
        codFuncionario: '',
        histo: '',
        //Variables para EDITAR
        nomFuncionario: '',
        dependencia: '',
        correo: '',
        rut: '',
        encargado: 0,
        codigoJardin: '',
        //Variables de las alertas
        dismissSecs: 5,
        dismissCountDown: 0,
        mensaje: {color: '', texto: ''}
      }
    },
    validations:{
        //Validaciones de los input
        codFuncionarioAgregar:{required},
        nomFuncionarioAgregar:{required, minLength: minLength(10)},
        correoAgregar:{required, email},
        rutAgregar:{required},
        nomFuncionario:{required, minLength: minLength(10)},
        correo:{required, email},
        rut:{required},
    },
    computed: {
      ...mapState(['token', 'usuarioDB'])
    },
    created(){
        this.cargarFuncionarios();
        this.cargarDependencias();
    },
    methods:{
        //Función que permite exportar las tablas en excel
        exportar(num) {
            let data = [];
            var filename = "planilla";
            if(num === 1){
                var arreglado = this.funcionarios.map( item => { 
                    return { CodigoFuncionario: item.codFuncionario , Funcionario : item.nomFuncionario, Correo : item.correo, Rut : item.rut, Dependencia: item.nomDependencia }; 
                });
                data = XLSX.utils.json_to_sheet(arreglado);
                filename = 'Funcionarios'
            }else if(num === 2){
                var arreglado = this.historial.map( item => { 
                    return { Memo: item.memo , Funcionario : item.nomFuncionario, Dependencia : item.nomDependencia, Fecha : item.fecha}; 
                });
                data = XLSX.utils.json_to_sheet(arreglado);
                if(arreglado[0]){
                    filename = 'Historial' + this.codFuncionario
                }else{
                    filename = 'Historial'
                }
            }else if(num === 3){
                var arreglado = this.detalleHist.map( item => { 
                    return { Producto: item.nomProducto , CodigoBarra : item.codigoBarra, Cantidad : item.cantidad }; 
                });
                data = XLSX.utils.json_to_sheet(arreglado);
                filename = 'Memo' + this.memoHist
            }
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, data, filename);
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        },
        //Función para cargar los Funcionarios del sistema
        cargarFuncionarios(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('api/obtenerFuncionarios', config)
            .then(res => {
                this.funcionarios = res.data;
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar los Funcionarios');
            })
        },
        //Función que se encargar de cargar las dependencias
        cargarDependencias(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.get('api/obtenerDependencias', config)
            .then(res => {
                this.dependencias = res.data;
                this.dependenciaAgregar = this.dependencias[0].nomDependencia;
                this.codigoJardinAgregar = res.data[0].codDependencia
            })
            .catch(e => {
                this.alerta('danger', 'No se han podido cargar las Dependencias');
            })
        },
        cambiaJardin(){
            const index = this.dependencias.findIndex(item => item.nomDependencia == this.dependenciaAgregar);
            this.codigoJardinAgregar = this.dependencias[index].codDependencia
        },
        cambiaJardinEditar(){
            const index = this.dependencias.findIndex(item => item.nomDependencia == this.dependencia);
            this.codigoJardin = this.dependencias[index].codDependencia
        },
        //Función para regresar a la vista inicial
        Volver(){
            $('#historial').DataTable().destroy();
            this.pestaña = 'funcionarios'
            $('#funcionarios').DataTable()
            this.cargarFuncionarios();
        },
        VolverHist(){
            $('#detalleHist').DataTable().destroy();
            this.pestaña = 'historial'
            this.cargarHistorial();
            $('#historial').DataTable()
        },
        //Funciones para cambiar de vistas
        ActAgregar(){
            this.pestaña = 'agregar'
            $('#funcionarios').DataTable().destroy();
        },
        Acteditar(codFuncionario){
            this.codFuncionario = codFuncionario
            this.pestaña = 'editar'
            $('#funcionarios').DataTable().destroy();
            this.ObtenerDatos();
        },
        ActHist(codFuncionario){
            this.codFuncionario = codFuncionario
            this.pestaña = 'historial'
            $('#funcionarios').DataTable().destroy();
            this.cargarHistorial();
        },
        ActDHist(corrHistorial, memo){
            this.histo = corrHistorial;
            this.memoHist = memo;
            this.pestaña = 'detalleHist'
            $('#historial').DataTable().destroy();
            $('#detalleHist').DataTable()
            this.cargarDetalleHistorial();
        },
        //Funciones de AGREGAR
        AgregarFuncionario(){
            this.$v.$touch()
            if(!this.$v.codFuncionarioAgregar.$invalid && !this.$v.nomFuncionarioAgregar.$invalid && !this.$v.correoAgregar.$invalid && !this.$v.rutAgregar.$invalid){
                let config = {
                    headers: {
                        token: this.token
                    }
                }
                this.axios.post('api/agregaFuncionario', {codFuncionario: this.codFuncionarioAgregar, nomFuncionario: this.nomFuncionarioAgregar, correo: this.correoAgregar, rut: this.rutAgregar, encargado: this.encargadoAgregar ,nomDependencia: this.dependenciaAgregar}, config)
                    .then(res => {
                    if(!res.data.sqlMessage){
                        Swal.fire(
                            'Se ha generado un nuevo Funcionario',
                            'Seleccione Ok para continuar',
                            'success'
                        )
                    }else{
                        Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha logrado crear al nuevo Funcionario',
                        footer: 'A ocurrido un error en el ingreso de los datos'
                        })
                    }
                    })
                    .catch(e => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se ha logrado crear al nuevo Funcionario',
                            footer: 'Posible error del sistema'
                        })
                    })
            }else{
                this.alerta('danger', 'Porfavor ingrese todos los campos requeridos')
            }
        },
        //FUNCIONES PARA EDITAR
        ObtenerDatos(){
            const index = this.funcionarios.findIndex(item => item.codFuncionario == this.codFuncionario);
            var data = this.funcionarios[index]
            this.nomFuncionario = data.nomFuncionario
            this.dependencia = data.nomDependencia
            this.correo = data.correo
            this.rut = data.rut
            this.encargado = data.encargado
            const index2 = this.dependencias.findIndex(item => item.nomDependencia == data.nomDependencia);
            this.codigoJardin = this.dependencias[index2].codDependencia
        },
        //Función que permite editar un Funcionario
        EditarFuncionario(){
            let config = {
                headers: {
                    token: this.token
                }
            }
            this.axios.put(`api/editarFuncionario/${this.codFuncionario}`, {nomFuncionario: this.nomFuncionario, correo: this.correo, rut: this.rut, encargado: this.encargado, nomDependencia: this.dependencia}, config)
                .then(res => {
                if(!res.data.sqlMessage){
                    Swal.fire(
                        'Se ha logrado editar al Funcionario',
                        'Seleccione Ok para continuar',
                        'success'
                    )
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se ha actualizado el funcionario',
                        footer: 'Dato repetido asegurese de que el codigo o nombre ya existan'
                    })
                }
                })
                .catch(e => {
                    this.alerta('danger', 'No se ha logrado editar al funcionario, Asegurese de que el nombre contenga alguna letra y supere los 10 caracteres');
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
            this.axios.get(`api/obtenerHistorialesFuncionario/${this.codFuncionario}`, config)
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
      await $('#historial').DataTable()
      await $('#detalleHist').DataTable()
    },
    watch: {
      funcionarios(val) {
        if(this.pestaña === 'funcionarios'){
          $('#funcionarios').DataTable().destroy();
          this.$nextTick(()=> {
            $('#funcionarios').DataTable()
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