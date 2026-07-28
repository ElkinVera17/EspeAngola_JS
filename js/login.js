const formLogin = document.querySelector(".login-card form");
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

let usuariosApi = [];

async function cargarUsuariosApi() {
    try {
        const respuesta = await fetch("https://dummyjson.com/users?limit=0");
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la informacion");
        }
        const datos = await respuesta.json();
        usuariosApi = datos.users;
        console.log("Usuarios API cargados", usuariosApi.length);
    } catch (error) {
        console.error("Tu error es", error);
    }
}

function validarLogin(evento) {
    evento.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const passwordIngresado = inputPassword.value.trim();

    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    const usuarioLocal = usuariosRegistrados.find(
        u => u.usuario === usuarioIngresado && u.password === passwordIngresado
    );

    if (usuarioLocal) {
        iniciarSesion(`${usuarioLocal.nombres} ${usuarioLocal.apellido}`, null, usuarioLocal.nacionalidad);
        return;
    }

    const usuarioApi = usuariosApi.find(
        u => u.username === usuarioIngresado && u.password === passwordIngresado
    );

    if (usuarioApi) {
        iniciarSesion(`${usuarioApi.firstName} ${usuarioApi.lastName}`, usuarioApi.image, null);
        return;
    }

    alert("Usuario o contraseña incorrectos");
}

function iniciarSesion(nombre, foto, nacionalidad) {
    sessionStorage.setItem("usuario", nombre);
    if (foto) sessionStorage.setItem("usuarioFoto", foto);
    if (nacionalidad) sessionStorage.setItem("usuarioNacionalidad", nacionalidad);
    localStorage.setItem("ultimoUsuario", nombre);
    window.location.href = "Principal/Angola.html";
}

function iniciarSesion(nombre, foto) {
    sessionStorage.setItem("usuario", nombre);
    if (foto) sessionStorage.setItem("usuarioFoto", foto);
    localStorage.setItem("ultimoUsuario", nombre);
    window.location.href = "Principal/Angola.html";
}

document.addEventListener("DOMContentLoaded", cargarUsuariosApi);
formLogin.addEventListener("submit", validarLogin);