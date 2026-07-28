function mostrarPerfil() {
    const nombre = sessionStorage.getItem("usuario");
    const foto = sessionStorage.getItem("usuarioFoto");
    const contenedorPerfil = document.getElementById("perfilUsuario");

    if (!contenedorPerfil) return;

    if (!nombre) {
        contenedorPerfil.innerHTML = `<span>Invitado</span>`;
        return;
    }

    contenedorPerfil.innerHTML = `
        <img src="${foto}" alt="${nombre}" width="40" height="40" style="border-radius:50%;">
        <span>${nombre}</span>
    `;
}

document.addEventListener("DOMContentLoaded", mostrarPerfil);