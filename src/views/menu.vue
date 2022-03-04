<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1 class="mt-2">Sistema de Stock de Bodegas</h1>
            <div class="mt-4">
                <b-row>
                    <b-col cols="12" md="12">
                        <img src="../assets/bodegas.png" class="logo">
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" md="12" class="texto">
                        <div class="card" style="border-color: black;">
                            <div class="card-body">
                                <p style="text-align: left;">Este sistema de bodegas tiene por objetivo facilitar un manejo de stock de los productos que se encuentran almacenados en bodega y luego son enviados a Direccion Regional
                                    Todo este proceso se realiza a traves de ordenes de compras, las cuales permiten el recibimiento de cada uno de estos productos y luego tambien utilizando este sistema se pueden
                                    enviar los productos a las diferentes dependendecias que los requieran a nombre de un funcionario.
                                </p>
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </div>
        </b-container>
    </div>
</template>

<script>
import navbar from "../components/navbar.vue";
export default {
    name: "about",
    components: {
        navbar,
    },
    created(){
        
    },
    methods:{
        
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

    .logo{
        width: 50%;
    }

    @media screen and (max-width: 480px){
        .imagen{
            width: 100%;
        }
    }
</style>