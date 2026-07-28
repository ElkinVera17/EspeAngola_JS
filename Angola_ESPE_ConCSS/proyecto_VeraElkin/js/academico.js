const contenedorCards = document.querySelector(".cards-container");
const inputBuscarPdf = document.getElementById("buscarPdf");
const selectFiltroMateria = document.getElementById("filtroMateria");
const selectFiltroCarrera = document.getElementById("filtroCarrera");
const selectOrdenarPdfs = document.getElementById("ordenarPdfs");

document.addEventListener("DOMContentLoaded", cargarPDFs);
inputBuscarPdf.addEventListener("input", buscar);
selectFiltroMateria.addEventListener("change", buscar);
selectFiltroCarrera.addEventListener("change", buscar);
selectOrdenarPdfs.addEventListener("change", buscar);

let pdfs = [];

async function cargarPDFs() {
    try {
        const respuesta = await fetch("../json/pdfs.json");
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los PDFs");
        }

        pdfs = await respuesta.json();

        llenarSelects();
        crearTarjetas(pdfs);
    } catch (error) {
        console.error(error);
        contenedorCards.innerHTML = "<p>No se pudieron cargar los documentos.</p>";
    }
}

function llenarSelects() {
    const materias = [...new Set(pdfs.map(pdf => pdf.materia))];
    const carreras = [...new Set(pdfs.map(pdf => pdf.carrera))];

    for (const materia of materias) {
        const opcion = document.createElement("option");
        opcion.value = materia;
        opcion.textContent = materia;
        selectFiltroMateria.appendChild(opcion);
    }

    for (const carrera of carreras) {
        const opcion = document.createElement("option");
        opcion.value = carrera;
        opcion.textContent = carrera;
        selectFiltroCarrera.appendChild(opcion);
    }
}

function buscar() {
    const termino = inputBuscarPdf.value.trim().toLowerCase();
    const materia = selectFiltroMateria.value;
    const carrera = selectFiltroCarrera.value;
    const orden = selectOrdenarPdfs.value;

    let resultado = pdfs.filter(pdf => {
        const coincideTexto =
            pdf.titulo.toLowerCase().includes(termino) ||
            pdf.profesor.toLowerCase().includes(termino);
        const coincideMateria = materia ? pdf.materia === materia : true;
        const coincideCarrera = carrera ? pdf.carrera === carrera : true;
        return coincideTexto && coincideMateria && coincideCarrera;
    });

    if (orden === "fecha-desc") {
        resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    } else if (orden === "fecha-asc") {
        resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    } else if (orden === "descargas-desc") {
        resultado.sort((a, b) => b.descargas - a.descargas);
    } else if (orden === "calificacion-desc") {
        resultado.sort((a, b) => b.calificacion - a.calificacion);
    }

    crearTarjetas(resultado);
}

function crearTarjetas(arregloPdfs) {
    contenedorCards.innerHTML = "";

    if (arregloPdfs.length === 0) {
        contenedorCards.innerHTML = "<p>No se encontraron documentos.</p>";
        return;
    }

    for (const pdf of arregloPdfs) {
        crearCard(pdf);
    }
}

function crearCard(pdf) {
    const articulo = document.createElement("article");
    articulo.className = "card";
    articulo.innerHTML = `
        <img src="${pdf.icono}" alt="PDF" width="80" height="80">
        <h3>${pdf.titulo}</h3>
        <div class="container-fluid p-0">
            <div class="row g-2 mb-2">
                <div class="col-12">
                    <span class="badge colorAcademic w-100 py-2 d-flex align-items-center justify-content-center">
                        <i class="fa-regular fa-folder-open me-1"></i>
                        ${pdf.materia}
                    </span>
                </div>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-6">
                    <span class="badge colorpiel w-100 py-2 d-flex align-items-center justify-content-center">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${pdf.fecha}
                    </span>
                </div>
                <div class="col-6">
                    <span class="badge colorpiel w-100 py-2 d-flex align-items-center justify-content-center">
                        <i class="fa-regular fa-cloud-arrow-down me-1"></i>
                        ${pdf.descargas} descargas
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p class="rating mb-0 text-center">
                        <i class="fa-solid fa-star text-warning"></i>
                        ${pdf.calificacion}/5.0
                        <span class="text-muted ms-2">(${pdf.comentario})</span>
                    </p>
                </div>
            </div>
        </div>
        <button class="btn btn-outline-info btn-pdf">Ver documento</button>
    `;

    articulo.querySelector(".btn-pdf").addEventListener("click", () => {
        window.open(pdf.pdf, "_blank");
    });

    contenedorCards.appendChild(articulo);
}

