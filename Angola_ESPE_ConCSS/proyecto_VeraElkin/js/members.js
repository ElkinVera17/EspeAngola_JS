const contenedorMembresias = document.querySelector(".membresias-container .d-flex");
const inputBuscarMembresia = document.getElementById("buscarMembresia");
const selectFiltroTipo = document.getElementById("filtroTipo");
const selectFiltroEstado = document.getElementById("filtroEstado");
const selectOrdenarMembresias = document.getElementById("ordenarMembresias");

document.addEventListener("DOMContentLoaded", cargarMembresias);
inputBuscarMembresia.addEventListener("input", buscar);
selectFiltroTipo.addEventListener("change", buscar);
selectFiltroEstado.addEventListener("change", buscar);
selectOrdenarMembresias.addEventListener("change", buscar);

let membresias = [];

async function cargarMembresias() {
    try {
        const respuesta = await fetch("../json/membresias.json");
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la informacion");
        }

        membresias = await respuesta.json();

        llenarSelectTipos();
        crearTarjetas(membresias);
    } catch (error) {
        console.error("Tu error es", error);
        contenedorMembresias.innerHTML = "<p>No se pudieron cargar las membresías.</p>";
    }
}

function llenarSelectTipos() {
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
    div.innerHTML = `
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

