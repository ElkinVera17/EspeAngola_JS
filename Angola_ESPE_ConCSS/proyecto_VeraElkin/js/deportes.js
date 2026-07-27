const contenedorEventos = document.querySelector(".cards-container");

async function cargarEventos() {
    try {
        const [respEventos, respDeportes] = await Promise.all([
            fetch("../json/eventos_deportivos.json"),
            fetch("../json/deportes.json")
        ]);

        if (!respEventos.ok || !respDeportes.ok) {
            throw new Error("No se pudo obtener la informacion");
        }

        const eventos = await respEventos.json();
        const deportes = await respDeportes.json();

        contenedorEventos.innerHTML = "";
        for (const evento of eventos) {
            const deporte = deportes.find(dep => dep.id === evento.deporteId);
            crearTarjetaEvento(evento, deporte);
        }
    } catch (error) {
        console.error("Tu error es", error);
        contenedorEventos.innerHTML = "<p>No se pudieron cargar los eventos.</p>";
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

document.addEventListener("DOMContentLoaded", cargarEventos);