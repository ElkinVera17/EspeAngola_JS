const contenedorEventos = document.querySelector(".cards-container");
const inputBuscarEvento = document.getElementById("buscarEvento");
const selectFiltroDeporte = document.getElementById("filtroDeporte");
const inputFiltroFecha = document.getElementById("filtroFecha");
const selectOrdenarEventos = document.getElementById("ordenarEventos");
document.addEventListener("DOMContentLoaded", cargarEventos);
inputBuscarEvento.addEventListener("input", buscar);
selectFiltroDeporte.addEventListener("change", buscar);
inputFiltroFecha.addEventListener("change", buscar);
selectOrdenarEventos.addEventListener("change", buscar);

let eventos = [];
let deportes = [];

async function cargarEventos() {
    try {
        const [respEventos, respDeportes] = await Promise.all([
            fetch("../json/eventos_deportivos.json"),
            fetch("../json/deportes.json")
        ]);

        if (!respEventos.ok || !respDeportes.ok) {
            throw new Error("No se pudo obtener la informacion");
        }

        eventos = await respEventos.json();
        deportes = await respDeportes.json();

        llenarSelectDeportes();
        crearTarjetas(eventos);
    } catch (error) {
        console.error("Tu error es", error);
        contenedorEventos.innerHTML = "<p>No se pudieron cargar los eventos.</p>";
    }
}

function llenarSelectDeportes() {
    for (const deporte of deportes) {
        const opcion = document.createElement("option");
        opcion.value = deporte.id;
        opcion.textContent = deporte.nombre;
        selectFiltroDeporte.appendChild(opcion);
    }
}

function buscar() {
    const termino = inputBuscarEvento.value.trim().toLowerCase();
    const deporteId = selectFiltroDeporte.value;
    const fecha = inputFiltroFecha.value;
    const orden = selectOrdenarEventos.value;

    let resultado = eventos.filter(evento => {
        const coincideTexto =
            evento.nombre.toLowerCase().includes(termino) ||
            evento.lugar.toLowerCase().includes(termino);
        const coincideDeporte = deporteId ? evento.deporteId === Number(deporteId) : true;
        const coincideFecha = fecha ? evento.fecha === fecha : true;
        return coincideTexto && coincideDeporte && coincideFecha;
    });

    if (orden === "fecha-asc") {
        resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } else if (orden === "fecha-desc") {
        resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (orden === "inscritos-asc") {
        resultado.sort((a, b) => a.inscritos - b.inscritos);
    } else if (orden === "inscritos-desc") {
        resultado.sort((a, b) => b.inscritos - a.inscritos);
    }

    crearTarjetas(resultado);
}

function crearTarjetas(arregloEventos) {
    contenedorEventos.innerHTML = "";

    if (arregloEventos.length === 0) {
        contenedorEventos.innerHTML = "<p>No se encontraron eventos.</p>";
        return;
    }

    for (const evento of arregloEventos) {
        const deporte = deportes.find(dep => dep.id === evento.deporteId);
        crearTarjetaEvento(evento, deporte);
    }
}

function crearTarjetaEvento(evento, deporte) {
    const porcentaje = Math.round((evento.inscritos / evento.capacidad) * 100);

    const articulo = document.createElement("article");
    articulo.className = "card";
    articulo.innerHTML = `
        <img src="${evento.imagen}" alt="${deporte ? deporte.nombre : evento.nombre}" width="200" height="100">
        <h3>${evento.nombre}</h3>
        <p>${deporte ? deporte.nombre : ""} | Fecha: ${evento.fecha} | ${evento.participantes} participantes</p>
        <p>En ${evento.lugar}</p>
        <progress value="${porcentaje}" max="100"></progress><span> ${porcentaje}%</span>
        <button class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#modalInscripcion">
            Inscribirse
        </button>
    `;
    contenedorEventos.appendChild(articulo);
}

