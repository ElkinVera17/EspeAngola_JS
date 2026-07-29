Angola - Comunidad ESPE
📋 Información del Proyecto
Nombre del proyecto: Angola - Comunidad ESPE

Estudiante: Elkin Vera

Carrera: Ingeniería en Tecnologías de la Información (ITIN)

Institución: Universidad de las Fuerzas Armadas ESPE - Santo Domingo

📖 Descripción
Angola es una plataforma web integral diseñada para fortalecer la comunidad estudiantil de la Universidad de las Fuerzas Armadas ESPE. Este proyecto centraliza cuatro servicios esenciales en un solo lugar, permitiendo a los estudiantes acceder a recursos académicos, participar en eventos deportivos, comprar y vender productos, y compartir suscripciones digitales.

La plataforma funciona como un ecosistema digital donde los miembros de la comunidad pueden colaborar, intercambiar recursos y mantener una convivencia más activa y conectada dentro del campus universitario.

🎯 Objetivo
General:
Desarrollar una plataforma web dinámica e interactiva que centralice los servicios de la comunidad estudiantil de la ESPE, mejorando la colaboración, el intercambio de recursos y la convivencia entre sus miembros mediante el uso de tecnologías frontend modernas.

Específicos:

Implementar un sistema de autenticación básico con registro de usuarios y login.

Diseñar cuatro módulos funcionales (Académico, Deportes, Market, Members).

Desarrollar un sistema CRUD completo con persistencia en localStorage.

Crear una interfaz responsiva y dinámica con JavaScript.

⚡ Funcionalidades
🔐 Autenticación
Registro de nuevos usuarios con validación de campos.

Inicio de sesión con usuarios locales (localStorage) o de API externa (DummyJSON).

Perfil de usuario con foto y nacionalidad.

📚 ESPE Académico
Visualización de documentos académicos (exámenes, guías).

Búsqueda por título o profesor.

Filtros por materia y carrera.

Ordenamiento por fecha, descargas o calificación.

Creación, edición y eliminación de documentos.

⚽ ESPE Deportes
Gestión de eventos deportivos.

Búsqueda por nombre o lugar.

Filtros por deporte y fecha.

Inscripción a eventos con confirmación.

Estadísticas de aceptación en tabla.

🛒 ESPE Market
Marketplace interno para compra/venta de productos.

Búsqueda y filtros por categoría y precio.

Sistema de "Me gusta" (likes) por usuario.

Carrito de compras con persistencia.

Gráfico de productos más populares.

👥 ESPE Members
Membresías compartidas (Netflix, Spotify, etc.).

Filtros por tipo de servicio y disponibilidad.

Creación, edición y eliminación de membresías.

Visualización de cupos disponibles.

📊 Estadísticas
Dashboard con KPIs de la comunidad.

Productos totales, eventos, membresías, documentos.

Categoría más popular y precio promedio.

🛠️ Tecnologías utilizadas
Tecnología	Uso
HTML5	Estructura semántica de las páginas
CSS3	Estilos y diseño visual
JavaScript (ES6+)	Lógica de negocio, manipulación del DOM, eventos
Bootstrap 5	Framework CSS para diseño responsivo
JSON	Almacenamiento de datos iniciales
localStorage	Persistencia de datos en el navegador
Fetch API	Consumo de APIs externas
📦 Librerías incorporadas
Librería	Finalidad
Bootstrap 5	Sistema de diseño responsivo y componentes UI
Font Awesome 6	Iconos vectoriales para la interfaz
SweetAlert2	Alertas y modales personalizados
Toastify	Notificaciones emergentes no intrusivas
Chart.js	Gráficos y visualización de datos
🔌 APIs consumidas
1. DummyJSON - Usuarios
URL: https://dummyjson.com/users

Uso: Autenticación de usuarios de prueba

Datos: username, password, firstName, lastName, image, email, address, company

2. DummyJSON - Miembros
URL: https://dummyjson.com/users?limit=8

Uso: Mostrar miembros de la comunidad

Datos: firstName, lastName, image, email, address.city, company.title

3. Rest Countries - Banderas
URL: https://restcountries.com/v3.1/name/{pais}?fields=flags

Uso: Obtener bandera según nacionalidad del usuario

Datos: flags.png

📁 Estructura de carpetas 
Angola/
├── index.html                    # Página de login
├── pages/
│   ├── Angola.html              # Página principal
│   ├── ESPEAcademic.html        # Módulo académico
│   ├── ESPEDeportes.html        # Módulo deportes
│   ├── ESPEMarket.html          # Módulo market
│   ├── ESPEMembers.html         # Módulo members
│   └── registro.html            # Registro de usuarios
├── css/
│   ├── general.css              # Estilos globales
│   ├── angola.css               # Estilos página principal
│   ├── ESPEAcademic.css         # Estilos académico
│   ├── ESPEDeportes.css         # Estilos deportes
│   ├── ESPEMarket.css           # Estilos market
│   ├── ESPEMembers.css          # Estilos members
│   ├── login.css                # Estilos login
│   └── registro.css             # Estilos registro
├── js/
│   ├── academico.js             # Lógica académico
│   ├── deportes.js              # Lógica deportes
│   ├── market.js                # Lógica market
│   ├── members.js               # Lógica members
│   ├── miembros.js              # Consumo API miembros
│   ├── login.js                 # Lógica login
│   ├── registro.js              # Lógica registro
│   ├── perfil.js                # Perfil de usuario
│   ├── estadisticas.js          # Estadísticas dashboard
│   ├── paises.js                # Búsqueda de países
│   └── toast.js                 # Notificaciones
├── json/
│   ├── categorias.json          # Categorías de productos
│   ├── deportes.json            # Lista de deportes
│   ├── eventos_deportivos.json  # Eventos deportivos
│   ├── membresias.json          # Membresías compartidas
│   ├── pdfs.json                # Documentos académicos
│   └── productos.json           # Productos del market
├── img/                         # Imágenes del proyecto
├── video/                       # Videos (carrusel)
└── README.md                    # Este archivo

 Instrucciones para ejecutar el proyecto
Requisitos previos
Navegador web moderno (Chrome, Firefox, Edge, Safari)

Conexión a internet (para librerías CDN y APIs)

Paso a paso
Clonar o descargar el proyecto
git clone https://github.com/tu-usuario/angola-comunidad-espe.git
O descarga el archivo ZIP y extráelo.

Abrir la aplicación

Localiza el archivo index.html en la raíz del proyecto.

Haz doble clic para abrirlo en tu navegador.

O usa una extensión como "Live Server" en VS Code.

Iniciar sesión

Opción 1 - Usuario de prueba (API):

Usuario: emily.johnson

Contraseña: emilyspass

Opción 2 - Registrarse:

Haz clic en "Registrarse"

Completa el formulario

Inicia sesión con tus credenciales

Explorar los módulos

Navega por los 4 módulos usando el menú superior.

Crea, edita y elimina contenido.

Prueba los filtros y buscadores.

Agrega productos al carrito.

Nota importante
Los datos se almacenan en localStorage de tu navegador. Si usas otro navegador o dispositivo, los datos no estarán sincronizados. Para reiniciar los datos a su estado original, usa el botón "Restablecer datos" en ESPEMarket.

📝 Créditos
Desarrollador: Elkin Vera
Institución: Universidad de las Fuerzas Armadas ESPE
Sede: Santo Domingo de los Tsáchilas
Año: 2026

📄 Licencia
Este proyecto es de uso académico y educativo. Todos los derechos reservados © 2026.
