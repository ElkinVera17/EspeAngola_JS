const contenedorMembresias = document.querySelector(".membresias-container .d-flex");
const inputBuscarMembresia = document.getElementById("buscarMembresia");
const selectFiltroTipo = document.getElementById("filtroTipo");
const selectFiltroEstado = document.getElementById("filtroEstado");
const selectOrdenarMembresias = document.getElementById("ordenarMembresias");
const formPublicarMembresia = document.querySelector(".form-publicar");
const modalEditarMembresia = new bootstrap.Modal(document.getElementById("modalEditarMembresia"));
const formEditarMembresia = document.getElementById("formEditarMembresia");

const CLAVE_STORAGE = "membresiasComunidad";
const IMAGEN_DEFECTO = "../img/img-default.png";

let membresias = [];

async function cargarMembresias() {
    try {
        const guardadas = localStorage.getItem(CLAVE_STORAGE);

        if (guardadas) {
            membresias = JSON.parse(guardadas);
        } else {
            const respuesta = await fetch("../json/membresias.json");
            if (!respuesta.ok) {
                throw new Error("No se pudo obtener la informacion");
            }
            membresias = await respuesta.json();
            guardarMembresias();
        }

        llenarSelectTipos();
        crearTarjetas(membresias);
        mostrarToast("Datos cargados", "info");
    } catch (error) {
        console.error("Tu error es", error);
        contenedorMembresias.innerHTML = "<p>No se pudieron cargar las membresías.</p>";
    }
}

function guardarMembresias() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(membresias));
}

function llenarSelectTipos() {
    selectFiltroTipo.innerHTML = `<option value="">Todos los tipos</option>`;
    const tipos = [...new Set(membresias.map(m => m.plataforma.tipo))];

    for (const tipo of tipos) {
        const opcion = document.createElement("option");
        opcion.value = tipo;
        opcion.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        selectFiltroTipo.appendChild(opcion);
    }
}

function buscar() {
    const termino = inputBuscarMembresia.value.trim().toLowerCase();
    const tipo = selectFiltroTipo.value;
    const estado = selectFiltroEstado.value;
    const orden = selectOrdenarMembresias.value;

    let resultado = membresias.filter(membresia => {
        const coincideNombre = membresia.servicio.toLowerCase().includes(termino);
        const coincideTipo = tipo ? membresia.plataforma.tipo === tipo : true;
        const coincideEstado = estado ? membresia.estado === estado : true;
        return coincideNombre && coincideTipo && coincideEstado;
    });

    if (orden === "precio-asc") {
        resultado.sort((a, b) => a.precioPorPersona - b.precioPorPersona);
    } else if (orden === "precio-desc") {
        resultado.sort((a, b) => b.precioPorPersona - a.precioPorPersona);
    } else if (orden === "espacios-desc") {
        resultado.sort((a, b) => {
            const disponiblesA = a.espaciosTotal - a.espaciosOcupados;
            const disponiblesB = b.espaciosTotal - b.espaciosOcupados;
            return disponiblesB - disponiblesA;
        });
    }

    crearTarjetas(resultado);
}

function crearTarjetas(arregloMembresias) {
    contenedorMembresias.innerHTML = "";

    if (arregloMembresias.length === 0) {
        contenedorMembresias.innerHTML = "<p>No se encontraron membresías.</p>";
        return;
    }

    for (const membresia of arregloMembresias) {
        crearTarjetaMembresia(membresia);
    }
}

function crearTarjetaMembresia(membresia) {
    const espaciosDisponibles = membresia.espaciosTotal - membresia.espaciosOcupados;
    const beneficios = membresia.beneficios
        .map(b => `<li class="list-group-item">${b}</li>`)
        .join("");

    const div = document.createElement("div");
    div.className = "card shadow-sm h-100";
    div.style.width = "18rem";
    div.style.position = "relative";
    div.innerHTML = `
        <div class="acciones-card">
            <button class="btn-editar" data-id="${membresia.id}" title="Editar">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-eliminar" data-id="${membresia.id}" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <img src="${membresia.imagen}" class="card-img-top" alt="${membresia.servicio}">
        <div class="card-body text-center">
            <h5 class="card-title bg-success text-white p-2 rounded">${membresia.servicio}</h5>
            <p class="card-text mt-2">Plataforma: ${membresia.plataforma.nombre}</p>
            <p class="espacios">
                <i class="fa-regular fa-user me-1"></i> Espacios: ${membresia.espaciosOcupados}/${membresia.espaciosTotal}
            </p>
        </div>
        <ul class="list-group list-group-flush text-center">
            ${beneficios}
            <li class="list-group-item fw-bold text-warning fs-5">
                <i class="fa-solid fa-coins me-2"></i> $${membresia.precioPorPersona.toFixed(2)} <small class="text-muted fs-6">/mes</small>
            </li>
        </ul>
        <div class="card-body text-center mt-auto">
            <a href="#" class="btn ${espaciosDisponibles > 0 ? "btn-success" : "btn-secondary disabled"} w-100">
                <i class="fa-regular fa-circle-check me-2"></i> ${espaciosDisponibles > 0 ? "Unirse" : "Completo"}
            </a>
        </div>
    `;
    contenedorMembresias.appendChild(div);
}

function publicarMembresia(evento) {
    evento.preventDefault();

    const servicio = document.getElementById("servicio").value.trim();
    const precioPorPersona = Number(document.getElementById("nuevoPrecio").value);
    const espaciosTotal = Number(document.getElementById("espacios").value);
    const archivoImagen = document.getElementById("imagenMembresia").files[0];

    if (!servicio || !precioPorPersona || !espaciosTotal) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa servicio, precio y espacios."
        });
        return;
    }

    if (precioPorPersona <= 0 || espaciosTotal < 2) {
        Swal.fire({
            icon: "warning",
            title: "Datos inválidos",
            text: "El precio debe ser mayor a 0 y los espacios mínimo 2."
        });
        return;
    }

    const idNuevo = membresias.length > 0 ? Math.max(...membresias.map(m => m.id)) + 1 : 1;

    const nuevaMembresia = {
        id: idNuevo,
        servicio,
        descripcion: `Membresía compartida de ${servicio}`,
        servicioId: idNuevo,
        precioTotal: Number((precioPorPersona * espaciosTotal).toFixed(2)),
        precioPorPersona,
        espaciosTotal,
        espaciosOcupados: 1,
        organizadorId: "usuario-local",
        fechaPublicacion: new Date().toISOString().split("T")[0],
        imagen: archivoImagen ? URL.createObjectURL(archivoImagen) : IMAGEN_DEFECTO,
        beneficios: ["Publicado por la comunidad"],
        estado: "activo",
        plataforma: {
            nombre: servicio,
            tipo: "servicio",
            sitioWeb: ""
        }
    };

    membresias.push(nuevaMembresia);
    guardarMembresias();
    llenarSelectTipos();
    buscar();
    formPublicarMembresia.reset();

   mostrarToast("Membresía agregada", "exito");
}

function eliminarMembresia(evento) {
    const boton = evento.target.closest(".btn-eliminar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const membresia = membresias.find(m => m.id === id);

    Swal.fire({
        icon: "warning",
        title: "¿Eliminar membresía?",
        text: `Se eliminará "${membresia.servicio}".`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (resultado.isConfirmed) {
            membresias = membresias.filter(m => m.id !== id);
            guardarMembresias();
            buscar();
            mostrarToast("Membresía eliminada", "error");
        }
    });
}


function abrirModalEditar(evento) {
    const boton = evento.target.closest(".btn-editar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const membresia = membresias.find(m => m.id === id);
    if (!membresia) return;

    document.getElementById("editId").value = membresia.id;
    document.getElementById("editServicio").value = membresia.servicio;
    document.getElementById("editPrecioPersona").value = membresia.precioPorPersona;
    document.getElementById("editEspaciosTotal").value = membresia.espaciosTotal;
    document.getElementById("editEspaciosOcupados").value = membresia.espaciosOcupados;

    modalEditarMembresia.show();
}

function guardarEdicionMembresia(evento) {
    evento.preventDefault();

    const id = Number(document.getElementById("editId").value);
    const servicio = document.getElementById("editServicio").value.trim();
    const precioPorPersona = Number(document.getElementById("editPrecioPersona").value);
    const espaciosTotal = Number(document.getElementById("editEspaciosTotal").value);
    const espaciosOcupados = Number(document.getElementById("editEspaciosOcupados").value);

    if (!servicio || !precioPorPersona || !espaciosTotal) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa servicio, precio y espacios totales."
        });
        return;
    }

    if (precioPorPersona <= 0 || espaciosTotal < 2) {
        Swal.fire({
            icon: "warning",
            title: "Datos inválidos",
            text: "El precio debe ser mayor a 0 y los espacios mínimo 2."
        });
        return;
    }

    if (espaciosOcupados > espaciosTotal) {
        Swal.fire({
            icon: "warning",
            title: "Datos inválidos",
            text: "Los espacios ocupados no pueden ser mayores a los totales."
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

        membresias = membresias.map(m =>
            m.id === id
                ? {
                    ...m,
                    servicio,
                    precioPorPersona,
                    espaciosTotal,
                    espaciosOcupados,
                    precioTotal: Number((precioPorPersona * espaciosTotal).toFixed(2)),
                    plataforma: { ...m.plataforma, nombre: servicio }
                }
                : m
        );

        guardarMembresias();
        buscar();
        modalEditarMembresia.hide();

      mostrarToast("Membresía actualizada", "exito");
    });
}

document.addEventListener("DOMContentLoaded", cargarMembresias);
inputBuscarMembresia.addEventListener("input", buscar);
selectFiltroTipo.addEventListener("change", buscar);
selectFiltroEstado.addEventListener("change", buscar);
selectOrdenarMembresias.addEventListener("change", buscar);
formPublicarMembresia.addEventListener("submit", publicarMembresia);
contenedorMembresias.addEventListener("click", eliminarMembresia);
contenedorMembresias.addEventListener("click", abrirModalEditar);
formEditarMembresia.addEventListener("submit", guardarEdicionMembresia);