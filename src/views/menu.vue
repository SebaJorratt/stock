<template>
    <div class="menu">
        <navbar />
        <b-container><br>
            <h1>Sistema de Stock de Bodegas</h1>
            <div class="mt-5">
                <b-row>
                    <b-col cols="12" md="6">
                        <img src="../assets/bodegas.png" class="imagen">
                    </b-col>
                    <b-col cols="12" md="6" class="texto mt-5">
                        <div class="card" style="border-color: black;">
                            <div class="card-body">
                                <p style="text-align: left;">Bienvenido al sistema de inventario, esta aplicación tiene por objetivo poder contabilizar los diferentes recursos que se pueden encontrar en bodegas.
                                    De los cuales cada uno esta relacionado para un determinado equipo. 
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
</style>