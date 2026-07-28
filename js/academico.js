const contenedorCards = document.querySelector(".cards-container");
const inputBuscarPdf = document.getElementById("buscarPdf");
const selectFiltroMateria = document.getElementById("filtroMateria");
const selectFiltroCarrera = document.getElementById("filtroCarrera");
const selectOrdenarPdfs = document.getElementById("ordenarPdfs");
const formNuevoArchivo = document.querySelector(".upload-section form");
const modalEditarPdf = new bootstrap.Modal(document.getElementById("modalEditarPdf"));
const formEditarPdf = document.getElementById("formEditarPdf");

const CLAVE_STORAGE = "pdfsAcademic";
const ICONO_DEFECTO = "../img/ESPEAcademic/pdf.png";

const NOMBRES_CARRERA = { "1": "ITIN", "2": "Agropecuaria", "3": "Biotecnologia" };
const NOMBRES_MATERIA = {
    "1": "EDO", "2": "POO", "3": "Calculo",
    "4": "Fisica", "5": "Computación digital", "6": "Liderazgo"
};

let pdfs = [];

async function cargarPDFs() {
    try {
        const guardados = localStorage.getItem(CLAVE_STORAGE);

        if (guardados) {
            pdfs = JSON.parse(guardados);
        } else {
            const respuesta = await fetch("../json/pdfs.json");
            if (!respuesta.ok) {
                throw new Error("No se pudieron cargar los PDFs");
            }
            pdfs = await respuesta.json();
            guardarPDFs();
        }

        llenarSelects();
        crearTarjetas(pdfs);
        mostrarToast("Datos cargados", "info");
    } catch (error) {
        console.error(error);
        contenedorCards.innerHTML = "<p>No se pudieron cargar los documentos.</p>";
    }
}

function guardarPDFs() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(pdfs));
}

function llenarSelects() {
    selectFiltroMateria.innerHTML = `<option value="">Todas las materias</option>`;
    selectFiltroCarrera.innerHTML = `<option value="">Todas las carreras</option>`;

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
    articulo.style.position = "relative";
    articulo.innerHTML = `
        <div class="acciones-card">
            <button class="btn-editar" data-id="${pdf.id}" title="Editar">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-eliminar" data-id="${pdf.id}" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
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

function crearArchivo(evento) {
    evento.preventDefault();

    const carrera = NOMBRES_CARRERA[document.getElementById("carrera2").value];
    const semestre = document.getElementById("nivel2").value;
    const materia = NOMBRES_MATERIA[document.getElementById("materia2").value];
    const profesor = document.getElementById("profesor2").value.trim();
    const archivo = document.getElementById("archivo").files[0];

    if (!carrera || !semestre || !materia || !profesor) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa carrera, semestre, materia y profesor."
        });
        return;
    }

    if (!archivo) {
        Swal.fire({
            icon: "warning",
            title: "Falta el archivo",
            text: "Debes subir un archivo PDF."
        });
        return;
    }

    const idNuevo = pdfs.length > 0 ? Math.max(...pdfs.map(p => p.id)) + 1 : 1;

    const nuevoPdf = {
        id: idNuevo,
        titulo: `Documento - ${materia}`,
        carrera,
        semestre,
        materia,
        profesor,
        fecha: new Date().toISOString().split("T")[0],
        descargas: 0,
        calificacion: 0,
        comentario: "Sin calificar",
        icono: ICONO_DEFECTO,
        pdf: URL.createObjectURL(archivo)
    };

    pdfs.push(nuevoPdf);
    guardarPDFs();
    llenarSelects();
    buscar();
    formNuevoArchivo.reset();

    mostrarToast("Documento agregado", "exito");
}

function eliminarArchivo(evento) {
    const boton = evento.target.closest(".btn-eliminar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const pdf = pdfs.find(p => p.id === id);

    Swal.fire({
        icon: "warning",
        title: "¿Eliminar documento?",
        text: `Se eliminará "${pdf.titulo}".`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (resultado.isConfirmed) {
            pdfs = pdfs.filter(p => p.id !== id);
            guardarPDFs();
            buscar();
            mostrarToast("Documento eliminado", "error");
        }
    });
}



function abrirModalEditar(evento) {
    const boton = evento.target.closest(".btn-editar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const pdf = pdfs.find(p => p.id === id);
    if (!pdf) return;

    document.getElementById("editId").value = pdf.id;
    document.getElementById("editTitulo").value = pdf.titulo;
    document.getElementById("editCarrera").value = pdf.carrera;
    document.getElementById("editMateria").value = pdf.materia;
    document.getElementById("editProfesor").value = pdf.profesor;

    modalEditarPdf.show();
}

function guardarEdicionPdf(evento) {
    evento.preventDefault();

    const id = Number(document.getElementById("editId").value);
    const titulo = document.getElementById("editTitulo").value.trim();
    const carrera = document.getElementById("editCarrera").value;
    const materia = document.getElementById("editMateria").value;
    const profesor = document.getElementById("editProfesor").value.trim();

    if (!titulo || !carrera || !materia || !profesor) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa título, carrera, materia y profesor."
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

        pdfs = pdfs.map(p =>
            p.id === id
                ? { ...p, titulo, carrera, materia, profesor }
                : p
        );

        guardarPDFs();
        llenarSelects();
        buscar();
        modalEditarPdf.hide();

        mostrarToast("Documento actualizado", "exito");
    });
}

document.addEventListener("DOMContentLoaded", cargarPDFs);
inputBuscarPdf.addEventListener("input", buscar);
selectFiltroMateria.addEventListener("change", buscar);
selectFiltroCarrera.addEventListener("change", buscar);
selectOrdenarPdfs.addEventListener("change", buscar);
formNuevoArchivo.addEventListener("submit", crearArchivo);
contenedorCards.addEventListener("click", eliminarArchivo);
contenedorCards.addEventListener("click", abrirModalEditar);
formEditarPdf.addEventListener("submit", guardarEdicionPdf);