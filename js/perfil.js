async function mostrarPerfil() {
    const nombre = sessionStorage.getItem("usuario");
    const foto = sessionStorage.getItem("usuarioFoto");
    const nacionalidad = sessionStorage.getItem("usuarioNacionalidad");
    const contenedorPerfil = document.getElementById("perfilUsuario");

    if (!contenedorPerfil) return;

    if (!nombre) {
        contenedorPerfil.innerHTML = `<span>Invitado</span>`;
        return;
    }

    // Caso 1: usuario de la API, ya tiene foto real
    if (foto) {
        contenedorPerfil.innerHTML = `
            <img src="${foto}" alt="${nombre}" width="40" height="40" style="border-radius:50%;">
            <span>${nombre}</span>
        `;
        return;
    }

    // Caso 2: usuario local, mostramos la bandera de su nacionalidad
    if (nacionalidad) {
        const banderaUrl = await obtenerBandera(nacionalidad);
        contenedorPerfil.innerHTML = `
            ${banderaUrl ? `<img src="${banderaUrl}" alt="${nacionalidad}" width="30" style="border-radius:4px;">` : ""}
            <span>${nombre}</span>
        `;
        return;
    }

    // Caso 3: no hay ni foto ni nacionalidad
    contenedorPerfil.innerHTML = `<span>${nombre}</span>`;
}

async function obtenerBandera(nombrePais) {
    const cache = sessionStorage.getItem("banderaCache_" + nombrePais);
    if (cache) return cache;

    try {
        const respuesta = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(nombrePais)}?fields=flags`);
        if (!respuesta.ok) return null;
        const datos = await respuesta.json();
        const url = datos[0]?.flags?.png || null;
        if (url) sessionStorage.setItem("banderaCache_" + nombrePais, url);
        return url;
    } catch (error) {
        console.error("No se pudo obtener la bandera", error);
        return null;
    }
}


document.addEventListener("DOMContentLoaded", mostrarPerfil);