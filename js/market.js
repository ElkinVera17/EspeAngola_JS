const contenedorProductos = document.querySelector(".cards-productos");
const inputBuscarProducto = document.getElementById("buscarProducto");
const selectFiltroCategoria = document.getElementById("filtroCategoria");
const inputFiltroPrecio = document.getElementById("filtroPrecio");
const selectOrdenar = document.getElementById("ordenarProductos");
const formPublicar = document.querySelector(".publicar-market form");
const modalEditarProducto = new bootstrap.Modal(document.getElementById("modalEditarProducto"));
const formEditarProducto = document.getElementById("formEditarProducto");

const botonRestablecer = document.getElementById("btnRestablecer");
let grafico = null;

const CLAVE_STORAGE = "productosMarket";
const CLAVE_CARRITO = "carritoMarket";
const IMAGEN_DEFECTO = "../img/img-default.png";

const cuerpoCarrito = document.getElementById("cuerpoCarrito");
const totalCarritoEl = document.getElementById("totalCarrito");
const badgeCarrito = document.getElementById("badgeCarrito");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");

let productos = [];
let categorias = [];
let carrito = cargarCarritoStorage();

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
        mostrarToast("Datos cargados", "info");
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
    renderizarGrafico();
}

function crearTarjetaProducto(producto, categoria) {
    const articulo = document.createElement("article");
    articulo.className = "card-producto";
    articulo.innerHTML = `
        <div class="acciones-card">
            <button class="btn-editar" data-id="${producto.id}" title="Editar">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-eliminar" data-id="${producto.id}" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="card-imagen" style="background-image: url('${producto.imagen}');"></div>
        <div class="card-info">
            <span class="badge">${categoria ? categoria.nombre : "Sin categoría"}</span>
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="likes"><i class="fa-solid fa-heart"></i> ${producto.likes}</p>
            <a href="#" class="btn-carrito" data-id="${producto.id}">Añadir al carrito</a>
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

    mostrarToast("Producto agregado", "exito");
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
            mostrarToast("Producto eliminado", "error");
        }
    });
}



function abrirModalEditar(evento) {
    const boton = evento.target.closest(".btn-editar");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById("editId").value = producto.id;
    document.getElementById("editNombre").value = producto.nombre;
    document.getElementById("editPrecio").value = producto.precio;
    document.getElementById("editDescripcion").value = producto.descripcion;

    const selectCategoria = document.getElementById("editCategoria");
    selectCategoria.innerHTML = categorias
        .map(cat => `<option value="${cat.id}" ${cat.id === producto.categoriaId ? "selected" : ""}>${cat.nombre}</option>`)
        .join("");

    modalEditarProducto.show();
}

function guardarEdicionProducto(evento) {
    evento.preventDefault();

    const id = Number(document.getElementById("editId").value);
    const nombre = document.getElementById("editNombre").value.trim();
    const categoriaId = Number(document.getElementById("editCategoria").value);
    const precio = Number(document.getElementById("editPrecio").value);
    const descripcionTexto = document.getElementById("editDescripcion").value.trim();

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

    Swal.fire({
        icon: "question",
        title: "¿Guardar cambios?",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (!resultado.isConfirmed) return;

        productos = productos.map(p =>
            p.id === id
                ? { ...p, nombre, categoriaId, precio, descripcion: descripcionTexto }
                : p
        );

        guardarProductos();
        buscar();
        modalEditarProducto.hide();

        mostrarToast("Producto actualizado", "exito");
    });
}



function renderizarGrafico() {
    const topProductos = [...productos]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 8);

    const etiquetas = topProductos.map(p => p.nombre);
    const datos = topProductos.map(p => p.likes);

    const ctx = document.getElementById("graficoVentas");

    if (grafico) {
        grafico.data.labels = etiquetas;
        grafico.data.datasets[0].data = datos;
        grafico.update();
        return;
    }

    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: etiquetas,
            datasets: [{
                label: "Ventas simuladas (likes)",
                data: datos,
                backgroundColor: "rgba(11, 114, 49, 0.7)"
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function restablecerDatos() {
    Swal.fire({
        icon: "warning",
        title: "¿Restablecer datos?",
        text: "Se perderán los productos creados o editados y volverán los datos originales.",
        showCancelButton: true,
        confirmButtonText: "Sí, restablecer",
        cancelButtonText: "Cancelar"
    }).then(async resultado => {
        if (!resultado.isConfirmed) return;

        try {
            const respProductos = await fetch("../json/productos.json");
            if (!respProductos.ok) {
                throw new Error("No se pudo obtener la informacion");
            }
            productos = await respProductos.json();
            guardarProductos();

            llenarSelectCategorias();
            buscar();

            Swal.fire({
                icon: "success",
                title: "Datos restablecidos",
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Tu error es", error);
            Swal.fire({
                icon: "error",
                title: "No se pudo restablecer",
                text: "Intenta nuevamente."
            });
        }
    });
}

function cargarCarritoStorage() {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : [];
}

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(evento) {
    const boton = evento.target.closest(".btn-carrito");
    if (!boton) return;
    evento.preventDefault();

    const id = Number(boton.dataset.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderizarCarrito();
    mostrarToast("Producto añadido al carrito", "exito");
}

function cambiarCantidadCarrito(id, delta) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        carrito = carrito.filter(i => i.id !== id);
    }

    guardarCarrito();
    renderizarCarrito();
}

function quitarDelCarrito(id) {
    carrito = carrito.filter(i => i.id !== id);
    guardarCarrito();
    renderizarCarrito();
    mostrarToast("Producto quitado del carrito", "error");
}

function vaciarCarrito() {
    if (carrito.length === 0) return;

    Swal.fire({
        icon: "warning",
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos del carrito.",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then(resultado => {
        if (!resultado.isConfirmed) return;
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        mostrarToast("Carrito vaciado", "info");
    });
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarToast("Tu carrito está vacío", "error");
        return;
    }

    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

    Swal.fire({
        icon: "success",
        title: "¡Compra realizada!",
        text: `Gracias por tu compra de $${total.toFixed(2)}. Coordina la entrega con el vendedor.`,
        confirmButtonText: "Genial"
    }).then(() => {
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        const offcanvasEl = document.getElementById("offcanvasExample");
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
    });
}

function renderizarCarrito() {
    cuerpoCarrito.innerHTML = "";

    if (carrito.length === 0) {
        cuerpoCarrito.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío</p>`;
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;

            const fila = document.createElement("div");
            fila.className = "item-carrito";
            fila.innerHTML = `
                <div class="fila-nombre">
                    <span class="nombre-producto">${item.nombre}</span>
                    <span class="subtotal-producto">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="fila-controles">
                    <span class="precio-unitario">$${item.precio.toFixed(2)} c/u</span>
                    <div class="control-cantidad">
                        <button type="button" class="btn-cantidad" data-accion="restar" data-id="${item.id}">-</button>
                        <span class="valor-cantidad">${item.cantidad}</span>
                        <button type="button" class="btn-cantidad" data-accion="sumar" data-id="${item.id}">+</button>
                        <button type="button" class="btn-quitar-carrito" data-id="${item.id}" title="Quitar">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `;
            cuerpoCarrito.appendChild(fila);
        });
    }

    const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    totalCarritoEl.textContent = `$${total.toFixed(2)}`;

    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    badgeCarrito.textContent = totalItems;
}

function manejarClicksCarrito(evento) {
    const botonCantidad = evento.target.closest(".btn-cantidad");
    if (botonCantidad) {
        const id = Number(botonCantidad.dataset.id);
        const delta = botonCantidad.dataset.accion === "sumar" ? 1 : -1;
        cambiarCantidadCarrito(id, delta);
        return;
    }

    const botonQuitar = evento.target.closest(".btn-quitar-carrito");
    if (botonQuitar) {
        quitarDelCarrito(Number(botonQuitar.dataset.id));
    }
}

contenedorProductos.addEventListener("click", agregarAlCarrito);
cuerpoCarrito.addEventListener("click", manejarClicksCarrito);
btnVaciarCarrito.addEventListener("click", vaciarCarrito);
btnFinalizarCompra.addEventListener("click", finalizarCompra);

botonRestablecer.addEventListener("click", restablecerDatos);

document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    renderizarCarrito();
});
inputBuscarProducto.addEventListener("input", buscar);
selectFiltroCategoria.addEventListener("change", buscar);
inputFiltroPrecio.addEventListener("input", buscar);
selectOrdenar.addEventListener("change", buscar);
formPublicar.addEventListener("submit", publicarProducto);
contenedorProductos.addEventListener("click", eliminarProducto);
contenedorProductos.addEventListener("click", abrirModalEditar);
formEditarProducto.addEventListener("submit", guardarEdicionProducto);