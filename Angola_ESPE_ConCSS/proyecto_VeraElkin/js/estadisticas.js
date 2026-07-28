async function obtenerDatos(claveStorage, rutaJson) {
    const guardados = localStorage.getItem(claveStorage);
    if (guardados) {
        return JSON.parse(guardados);
    }

    try {
        const respuesta = await fetch(rutaJson);
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la informacion");
        }
        return await respuesta.json();
    } catch (error) {
        console.error("Tu error es", error);
        return [];
    }
}

async function cargarEstadisticas() {
    const [productos, categorias, eventos, membresias, pdfs] = await Promise.all([
        obtenerDatos("productosMarket", "../json/productos.json"),
        fetch("../json/categorias.json").then(r => r.ok ? r.json() : []).catch(() => []),
        obtenerDatos("eventosDeportivos", "../json/eventos_deportivos.json"),
        obtenerDatos("membresiasComunidad", "../json/membresias.json"),
        obtenerDatos("pdfsAcademic", "../json/pdfs.json")
    ]);

    // Total de productos
    document.getElementById("statTotalProductos").textContent = productos.length;

    // Total de eventos deportivos
    document.getElementById("statTotalEventos").textContent = eventos.length;

    // Categoría con más productos (reduce para contar apariciones)
    const conteoCategorias = productos.reduce((acumulador, producto) => {
        acumulador[producto.categoriaId] = (acumulador[producto.categoriaId] || 0) + 1;
        return acumulador;
    }, {});

    let categoriaTopId = null;
    let maxCantidad = 0;
    for (const idCategoria in conteoCategorias) {
        if (conteoCategorias[idCategoria] > maxCantidad) {
            maxCantidad = conteoCategorias[idCategoria];
            categoriaTopId = Number(idCategoria);
        }
    }

    const categoriaTop = categorias.find(cat => cat.id === categoriaTopId);
    document.getElementById("statCategoriaTop").textContent = categoriaTop ? categoriaTop.nombre : "-";

    // Precio promedio (reduce para sumar y dividir)
    const sumaPrecios = productos.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    const precioPromedio = productos.length > 0 ? sumaPrecios / productos.length : 0;
    document.getElementById("statPrecioPromedio").textContent = `$${precioPromedio.toFixed(2)}`;

    // Membresías activas (filter: espacios disponibles)
    const membresiasActivas = membresias.filter(m => m.espaciosOcupados < m.espaciosTotal);
    document.getElementById("statMembresias").textContent = membresiasActivas.length;

    // Documentos académicos
    document.getElementById("statDocumentos").textContent = pdfs.length;
}

document.addEventListener("DOMContentLoaded", cargarEstadisticas);