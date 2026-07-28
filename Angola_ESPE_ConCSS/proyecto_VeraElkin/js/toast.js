function mostrarToast(mensaje, tipo = "exito") {
    const colores = {
        exito: "linear-gradient(to right, #0b7231, #16a34a)",
        error: "linear-gradient(to right, #dc3545, #b02a37)",
        info: "linear-gradient(to right, #0d6efd, #0a58ca)"
    };

    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: colores[tipo] || colores.exito },
        stopOnFocus: true
    }).showToast();
}