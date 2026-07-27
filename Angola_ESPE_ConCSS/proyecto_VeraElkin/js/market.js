const contenedorProductos = document.querySelector(".cards-productos");

async function cargarProductos() {
    try {
        const [respProductos, respCategorias] = await Promise.all([
            fetch("../json/productos.json"),
            fetch("../json/categorias.json")
        ]);

        if (!respProductos.ok || !respCategorias.ok) {
            throw new Error("No se pudo obtener la informacion");
        }

        const productos = await respProductos.json();
        const categorias = await respCategorias.json();

        contenedorProductos.innerHTML = "";
        for (const producto of productos) {
            const categoria = categorias.find(cat => cat.id === producto.categoriaId);
            crearTarjetaProducto(producto, categoria);
        }
    } catch (error) {
        console.error("Tu error es", error);
        contenedorProductos.innerHTML = "<p>No se pudieron cargar los productos.</p>";
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