const contenedorMembresias = document.querySelector(".membresias-container .d-flex");

async function cargarMembresias() {
    try {
        const respuesta = await fetch("../json/membresias.json");
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la informacion");
        }

        const membresias = await respuesta.json();

        contenedorMembresias.innerHTML = "";
        for (const membresia of membresias) {
            crearTarjetaMembresia(membresia);
        }
    } catch (error) {
        console.error("Tu error es", error);
        contenedorMembresias.innerHTML = "<p>No se pudieron cargar las membresías.</p>";
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

document.addEventListener("DOMContentLoaded", cargarMembresias);