// js/paises.js
// Consumo de la API countries.dev para el selector de nacionalidad en el registro

const inputBuscarPais = document.getElementById("buscarPais");
const listaPaises = document.getElementById("listaPaises");
const paisSeleccionadoInput = document.getElementById("paisSeleccionado");
const paisSeleccionadoTexto = document.getElementById("paisSeleccionadoTexto");
const estadoPaises = document.getElementById("estadoPaises");

let paises = []; // aquí se guarda el arreglo completo que llega de la API

async function cargarPaises() {
    estadoPaises.textContent = "Cargando países...";
    try {
        const respuesta = await fetch("https://countries.dev/countries");
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la lista de países");
        }
        const datos = await respuesta.json();
        paises = datos; // OJO: esta API entrega el arreglo directo, no datos.countries
        console.log("JSON completo", datos);
        console.log("Total de países", paises.length);
        estadoPaises.textContent = "Escribe para buscar tu país (" + paises.length + " disponibles)";
    } catch (error) {
        console.error("Tu error es", error);
        estadoPaises.textContent = "No se pudieron cargar los países. Intenta recargar la página.";
    }
}

function mostrarSugerencias(filtro) {
    listaPaises.innerHTML = "";

    if (filtro.trim().length === 0) {
        listaPaises.style.display = "none";
        return;
    }

    const coincidencias = paises
        .filter(pais => pais.name.toLowerCase().includes(filtro.toLowerCase()))
        .slice(0, 8); // máximo 8 sugerencias para no saturar la lista

    if (coincidencias.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No se encontraron países";
        listaPaises.appendChild(item);
        listaPaises.style.display = "block";
        return;
    }

    for (const pais of coincidencias) {
        const item = document.createElement("li");
        item.classList.add("item-pais");
        item.innerHTML = `<img src="${pais.flags.png}" alt="${pais.name}" width="24"> ${pais.name}`;

        item.addEventListener("click", () => seleccionarPais(pais));

        listaPaises.appendChild(item);
    }

    listaPaises.style.display = "block";
}

function seleccionarPais(pais) {
    paisSeleccionadoInput.value = pais.name; // esto es lo que se guarda/envía en el registro
    paisSeleccionadoTexto.innerHTML = `<img src="${pais.flags.png}" alt="${pais.name}" width="20"> ${pais.name}`;
    inputBuscarPais.value = pais.name;
    listaPaises.innerHTML = "";
    listaPaises.style.display = "none";
}

// Búsqueda en tiempo real mientras el usuario escribe
inputBuscarPais.addEventListener("input", () => {
    paisSeleccionadoInput.value = ""; // si vuelve a escribir, invalidamos la selección previa
    mostrarSugerencias(inputBuscarPais.value);
});

// Cierra la lista si el usuario hace clic fuera del campo
document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".campo-nacionalidad")) {
        listaPaises.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", cargarPaises);