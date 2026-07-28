// js/miembros.js
// Consumo de la API DummyJSON para mostrar usuarios como miembros de la comunidad

const contenedorMiembros = document.getElementById("contenedorMiembros");
const estadoMiembros = document.getElementById("estadoMiembros");

async function cargarMiembros() {
    estadoMiembros.textContent = "Cargando miembros...";
    contenedorMiembros.innerHTML = "";
    try {
        const respuesta = await fetch("https://dummyjson.com/users?limit=8");
        if (!respuesta.ok) {
            throw new Error("No se obtuvo la información de usuarios");
        }
        const datos = await respuesta.json();
        const usuarios = datos.users;
        console.log("JSON completo", datos);
        console.log("Arreglo de usuarios", usuarios);

        for (const usuario of usuarios) {
            crearTarjetaMiembro(usuario);
        }

        estadoMiembros.textContent = "Miembros cargados: " + usuarios.length;
    } catch (error) {
        console.error("Tu error es", error);
        estadoMiembros.textContent = "No se pudo cargar la lista de miembros.";
    }
}

function crearTarjetaMiembro(usuario) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card", "shadow-sm", "h-100");
    tarjeta.style.width = "18rem";

    tarjeta.innerHTML = `
        <img src="${usuario.image}" class="card-img-top" alt="${usuario.firstName}" style="width:100px; margin:10px auto;">
        <div class="card-body text-center">
            <h5 class="card-title">${usuario.firstName} ${usuario.lastName}</h5>
            <p class="card-text mb-1"><i class="fa-solid fa-envelope me-1"></i> ${usuario.email}</p>
            <p class="card-text mb-1"><i class="fa-solid fa-location-dot me-1"></i> ${usuario.address.city}</p>
            <p class="card-text"><i class="fa-solid fa-briefcase me-1"></i> ${usuario.company.title}</p>
        </div>
    `;

    contenedorMiembros.appendChild(tarjeta);
}

document.addEventListener("DOMContentLoaded", cargarMiembros);