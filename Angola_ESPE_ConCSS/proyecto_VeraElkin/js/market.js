const contenedorProductos = document.querySelector(".cards-productos");
const inputBuscarProducto = document.getElementById("buscarProducto");
const selectFiltroCategoria = document.getElementById("filtroCategoria");
const inputFiltroPrecio = document.getElementById("filtroPrecio");
const selectOrdenar = document.getElementById("ordenarProductos");

let productos = [];
let categorias = [];

async function cargarProductos() {
    try {
        const [respProductos, respCategorias] = await Promise.all([
            fetch("../json/productos.json"),
            fetch("../json/categorias.json")
        ]);

        if (!respProductos.ok || !respCategorias.ok) {
            throw new Error("No se pudo obtener la informacion");
        }

        productos = await respProductos.json();
        categorias = await respCategorias.json();

        llenarSelectCategorias();
        crearTarjetas(productos);
    } catch (error) {
        console.error("Tu error es", error);
        contenedorProductos.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    }
}

function llenarSelectCategorias() {
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

document.addEventListener("DOMContentLoaded", cargarProductos);
inputBuscarProducto.addEventListener("input", buscar);
selectFiltroCategoria.addEventListener("change", buscar);
inputFiltroPrecio.addEventListener("input", buscar);
selectOrdenar.addEventListener("change", buscar);