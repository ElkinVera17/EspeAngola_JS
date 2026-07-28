const contenedorEventos = document.querySelector(".cards-container");
const inputBuscarEvento = document.getElementById("buscarEvento");
const selectFiltroDeporte = document.getElementById("filtroDeporte");
const inputFiltroFecha = document.getElementById("filtroFecha");
const selectOrdenarEventos = document.getElementById("ordenarEventos");
const formCrearEvento = document.querySelector(".upload-section form");
const modalEditarEvento = new bootstrap.Modal(document.getElementById("modalEditarEvento"));
const formEditarEvento = document.getElementById("formEditarEvento");

const CLAVE_STORAGE = "eventosDeportivos";
const IMAGEN_DEFECTO = "../img/img-default.png";

let eventos = [];
let deportes = [];

async function cargarEventos() {
    try {
        const respDeportes = await fetch("../json/deportes.json");
        if (!respDeportes.ok) {
            throw new Error("No se pudo obtener la informacion");
        }
        deportes = await respDeportes.json();

        const guardados = localStorage.getItem(CLAVE_STORAGE);

        if (guardados) {
            eventos = JSON.parse(guardados);
        } else {
            const respEventos = await fetch("../json/eventos_deportivos.json");
            if (!respEventos.ok) {
                throw new Error("No se pudo obtener la informacion");
            }
            eventos = await respEventos.json();
            guardarEventos();
        }

        llenarSelectDeportes();
        crearTarjetas(eventos);
        mostrarToast("Datos cargados", "info");
    } catch (error) {
        console.error("Tu error es", error);
        contenedorEventos.innerHTML = "<p>No se pudieron cargar los eventos.</p>";
    }
}

function guardarEventos() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(eventos));
}

function llenarSelectDeportes() {
    selectFiltroDeporte.innerHTML = `<option value="">Todos los deportes</option>`;
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
    articulo.style.position = "relative";
    articulo.innerHTML = `
        <div class="acciones-card">
            <button class="btn-editar" data-id="${evento.id}" title="Editar">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-eliminar" data-id="${evento.id}" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
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

function crearEvento(evento) {
    evento.preventDefault();

    const deporteId = Number(document.getElementById("nuevoDeporte").value);
    const nombre = document.getElementById("nombreEvento").value.trim();
    const fecha = document.getElementById("fechaEvento").value;
    const lugar = document.getElementById("lugarEvento").value.trim();
    const archivoImagen = document.getElementById("imagen").files[0];

    if (!deporteId || !nombre || !fecha || !lugar) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa deporte, nombre, fecha y lugar."
        });
        return;
    }

    const idNuevo = eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;

    const nuevoEvento = {
        id: idNuevo,
        nombre,
        descripcion: `Evento organizado por la comunidad ESPE`,
        deporteId,
        fecha,
        hora: "00:00",
        lugar,
        capacidad: 20,
        participantes: 0,
        inscritos: 0,
        estado: "abierto",
        imagen: archivoImagen ? URL.createObjectURL(archivoImagen) : IMAGEN_DEFECTO,
        organizadorId: "usuario-local"
    };

    eventos.push(nuevoEvento);
    guardarEventos();
    buscar();
    formCrearEvento.reset();

    mostrarToast("Evento agregado", "exito");
}

function eliminarEvento(evento) {
    const boton = evento.target.closest(".btn-eliminar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const eventoEncontrado = eventos.find(e => e.id === id);

    Swal.fire({
        icon: "warning",
        title: "¿Eliminar evento?",
        text: `Se eliminará "${eventoEncontrado.nombre}".`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (resultado.isConfirmed) {
            eventos = eventos.filter(e => e.id !== id);
            guardarEventos();
            buscar();
            mostrarToast("Evento eliminado", "error");
        }
    });
}


function abrirModalEditar(evento) {
    const boton = evento.target.closest(".btn-editar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const eventoEncontrado = eventos.find(e => e.id === id);
    if (!eventoEncontrado) return;

    document.getElementById("editId").value = eventoEncontrado.id;
    document.getElementById("editNombreEvento").value = eventoEncontrado.nombre;
    document.getElementById("editFecha").value = eventoEncontrado.fecha;
    document.getElementById("editLugar").value = eventoEncontrado.lugar;
    document.getElementById("editCapacidad").value = eventoEncontrado.capacidad;

    const selectDeporte = document.getElementById("editDeporte");
    selectDeporte.innerHTML = deportes
        .map(dep => `<option value="${dep.id}" ${dep.id === eventoEncontrado.deporteId ? "selected" : ""}>${dep.nombre}</option>`)
        .join("");

    modalEditarEvento.show();
}

function guardarEdicionEvento(evento) {
    evento.preventDefault();

    const id = Number(document.getElementById("editId").value);
    const deporteId = Number(document.getElementById("editDeporte").value);
    const nombre = document.getElementById("editNombreEvento").value.trim();
    const fecha = document.getElementById("editFecha").value;
    const lugar = document.getElementById("editLugar").value.trim();
    const capacidad = Number(document.getElementById("editCapacidad").value);

    if (!deporteId || !nombre || !fecha || !lugar || !capacidad) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa deporte, nombre, fecha, lugar y capacidad."
        });
        return;
    }

    Swal.fire({
        icon: "question",
        title: "¿Guardar cambios?",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (!resultado.isConfirmed) return;

        eventos = eventos.map(e =>
            e.id === id
                ? { ...e, deporteId, nombre, fecha, lugar, capacidad }
                : e
        );

        guardarEventos();
        buscar();
        modalEditarEvento.hide();

        mostrarToast("Evento actualizado", "exito");
    });
}

document.getElementById("btnConfirmarInscripcion").addEventListener("click", () => {
    mostrarToast("Reserva realizada", "exito");
});

document.addEventListener("DOMContentLoaded", cargarEventos);
inputBuscarEvento.addEventListener("input", buscar);
selectFiltroDeporte.addEventListener("change", buscar);
inputFiltroFecha.addEventListener("change", buscar);
selectOrdenarEventos.addEventListener("change", buscar);
formCrearEvento.addEventListener("submit", crearEvento);
contenedorEventos.addEventListener("click", eliminarEvento);
contenedorEventos.addEventListener("click", abrirModalEditar);
formEditarEvento.addEventListener("submit", guardarEdicionEvento);