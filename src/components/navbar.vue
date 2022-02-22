<template>
  <div class="hello"> 
        <div id="navegador">
            <b-navbar toggleable="md" type="dark" variant="success">
                <b-container>
                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                    
                    <router-link to="/menu"> <img src="../assets/logoborde.png" alt="" width="50px" class="iconJunji">  <b-navbar-brand > Sistema de Stock</b-navbar-brand></router-link> 
                     <b-collapse id="nav-collapse" is-nav>
                         <b-navbar-nav>
                            <b-nav-item >Lista de equipos</b-nav-item>
                            <b-nav-item >Agregar Equipo</b-nav-item>
                            <b-nav-item >Funcionarios</b-nav-item>
                            <b-nav-item >Dependencia</b-nav-item>
                        </b-navbar-nav>
                        <b-navbar-nav class="ml-auto">
                            <b-nav-form>
                                <div class="dropdown">
                                <button class="btn dropdown-toggle" type="button dark" style="border-color: black;" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Nombre
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#">Ver perfil</a></li>
                                    <li><a class="dropdown-item" href="#" >Gestión de Usuarios</a></li>
                                    <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
                                </ul>
                                </div>
                            </b-nav-form>
                        </b-navbar-nav>
                     </b-collapse>  
                </b-container>
            </b-navbar>
        </div>
    </div>
</template>

<script>
export default {
  name: 'navbar',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  
</style>
