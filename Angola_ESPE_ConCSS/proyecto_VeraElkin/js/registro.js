const formRegistro = document.querySelector(".registrate form");

function guardarUsuario(evento) {
    evento.preventDefault();

    const nombres = document.getElementById("Nombres").value.trim();
    const apellido = document.getElementById("Apellido").value.trim();
    const cedula = document.getElementById("Cedula").value.trim();
    const correo = document.getElementById("Correo").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const nacionalidad = document.getElementById("paisSeleccionado").value;

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    const usuarioExiste = usuariosRegistrados.some(u => u.usuario === usuario);
    if (usuarioExiste) {
        alert("Ese nombre de usuario ya existe");
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombres,
        apellido,
        cedula,
        correo,
        usuario,
        password,
        nacionalidad
    };

    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

    alert("Registro exitoso, ahora puedes iniciar sesión");
    window.location.href = "../index.html";
}

formRegistro.addEventListener("submit", guardarUsuario);