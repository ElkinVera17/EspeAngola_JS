const contenedorProductos = document.querySelector(".cards-productos");
const inputBuscarProducto = document.getElementById("buscarProducto");
const selectFiltroCategoria = document.getElementById("filtroCategoria");
const inputFiltroPrecio = document.getElementById("filtroPrecio");
const selectOrdenar = document.getElementById("ordenarProductos");
const formPublicar = document.querySelector(".publicar-market form");

const CLAVE_STORAGE = "productosMarket";
const IMAGEN_DEFECTO = "../img/img-default.png";

let productos = [];
let categorias = [];

async function cargarProductos() {
    try {
        const respCategorias = await fetch("../json/categorias.json");
        if (!respCategorias.ok) {
            throw new Error("No se pudo obtener la informacion");
        }
        categorias = await respCategorias.json();

        const guardados = localStorage.getItem(CLAVE_STORAGE);

        if (guardados) {
            productos = JSON.parse(guardados);
        } else {
            const respProductos = await fetch("../json/productos.json");
            if (!respProductos.ok) {
                throw new Error("No se pudo obtener la informacion");
            }
            productos = await respProductos.json();
            guardarProductos();
        }

        llenarSelectCategorias();
        crearTarjetas(productos);
    } catch (error) {
        console.error("Tu error es", error);
        contenedorProductos.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    }
}

function guardarProductos() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

function llenarSelectCategorias() {
    selectFiltroCategoria.innerHTML = `<option value="">Todas las categorías</option>`;
    for (const categoria of categorias) {
        const opcion = document.createElement("option");
        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;
        selectFiltroCategoria.appendChild(opcion);
    }
}

function buscar() {
    const termino = inputBuscarProducto.value.trim().toLowerCase();
    const categoriaId = selectFiltroCategoria.value;
    const precioMax = inputFiltroPrecio.value;
    const orden = selectOrdenar.value;

    let resultado = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(termino);
        const coincideCategoria = categoriaId ? producto.categoriaId === Number(categoriaId) : true;
        const coincidePrecio = precioMax ? producto.precio <= Number(precioMax) : true;
        return coincideNombre && coincideCategoria && coincidePrecio;
    });

    if (orden === "precio-asc") {
        resultado.sort((a, b) => a.precio - b.precio);
    } else if (orden === "precio-desc") {
        resultado.sort((a, b) => b.precio - a.precio);
    } else if (orden === "nombre-asc") {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === "nombre-desc") {
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    crearTarjetas(resultado);
}

function crearTarjetas(arregloProductos) {
    contenedorProductos.innerHTML = "";

    if (arregloProductos.length === 0) {
        contenedorProductos.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    for (const producto of arregloProductos) {
        const categoria = categorias.find(cat => cat.id === producto.categoriaId);
        crearTarjetaProducto(producto, categoria);
    }
}

function crearTarjetaProducto(producto, categoria) {
    const articulo = document.createElement("article");
    articulo.className = "card-producto";
    articulo.innerHTML = `
        <button class="btn-eliminar" data-id="${producto.id}" title="Eliminar">
            <i class="fa-solid fa-trash"></i>
        </button>
        <div class="card-imagen" style="background-image: url('${producto.imagen}');"></div>
        <div class="card-info">
            <span class="badge">${categoria ? categoria.nombre : "Sin categoría"}</span>
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="likes"><i class="fa-solid fa-heart"></i> ${producto.likes}</p>
            <a href="#" class="btn-carrito">Añadir al carrito</a>
        </div>
    `;
    contenedorProductos.appendChild(articulo);
}

function publicarProducto(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nuevoProducto").value.trim();
    const categoriaId = Number(document.getElementById("nuevaCategoria").value);
    const precio = Number(document.getElementById("nuevoPrecio").value);
    const descripcionTexto = document.getElementById("descripcion").value.trim();
    const archivoImagen = document.getElementById("imagen").files[0];

    if (!nombre || !categoriaId || !precio || !descripcionTexto) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa nombre, categoría, precio y descripción."
        });
        return;
    }

    if (precio <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Precio inválido",
            text: "El precio debe ser mayor a 0."
        });
        return;
    }

    const idNuevo = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

    const nuevoProducto = {
        id: idNuevo,
        nombre,
        descripcion: descripcionTexto,
        precio,
        categoriaId,
        vendedorId: "usuario-local",
        fechaPublicacion: new Date().toISOString().split("T")[0],
        imagen: archivoImagen ? URL.createObjectURL(archivoImagen) : IMAGEN_DEFECTO,
        likes: 0,
        disponible: true
    };

    productos.push(nuevoProducto);
    guardarProductos();
    buscar();
    formPublicar.reset();

    Swal.fire({
        icon: "success",
        title: "Producto publicado",
        text: `"${nombre}" se agregó correctamente.`,
        timer: 2000,
        showConfirmButton: false
    });
}

function eliminarProducto(evento) {
    const boton = evento.target.closest(".btn-eliminar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const producto = productos.find(p => p.id === id);

    Swal.fire({
        icon: "warning",
        title: "¿Eliminar producto?",
        text: `Se eliminará "${producto.nombre}".`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (resultado.isConfirmed) {
            productos = productos.filter(p => p.id !== id);
            guardarProductos();
            buscar();
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", cargarProductos);
inputBuscarProducto.addEventListener("input", buscar);
selectFiltroCategoria.addEventListener("change", buscar);
inputFiltroPrecio.addEventListener("input", buscar);
selectOrdenar.addEventListener("change", buscar);
formPublicar.addEventListener("submit", publicarProducto);
contenedorProductos.addEventListener("click", eliminarProducto);