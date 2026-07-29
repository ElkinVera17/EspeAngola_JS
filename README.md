# Angola - Comunidad ESPE

## 📋 Información del Proyecto

- **Nombre del proyecto:** Angola - Comunidad ESPE
- **Estudiante:** Elkin Vera
- **Carrera:** Ingeniería en Tecnologías de la Información (ITIN)
- **Institución:** Universidad de las Fuerzas Armadas ESPE - Santo Domingo

---

## 📖 Descripción

**Angola - Comunidad ESPE** es una plataforma web desarrollada para fortalecer la interacción entre los estudiantes de la Universidad de las Fuerzas Armadas ESPE. Centraliza cuatro servicios principales en un solo sitio, permitiendo acceder a recursos académicos, participar en actividades deportivas, comprar y vender productos dentro de la comunidad universitaria y compartir membresías digitales.

La plataforma busca facilitar la colaboración entre estudiantes mediante una interfaz moderna, dinámica y responsiva.

---

## 🎯 Objetivos

### Objetivo General

Desarrollar una plataforma web dinámica e interactiva que centralice distintos servicios de la comunidad estudiantil de la ESPE, promoviendo la colaboración, el intercambio de recursos y la participación mediante tecnologías frontend.

### Objetivos Específicos

- Implementar un sistema de autenticación con registro e inicio de sesión.
- Diseñar cuatro módulos funcionales: Académico, Deportes, Market y Members.
- Desarrollar operaciones CRUD con persistencia mediante LocalStorage.
- Crear una interfaz moderna, responsiva e interactiva utilizando JavaScript.

---

## ⚡ Funcionalidades

### 🔐 Autenticación

- Registro de usuarios con validación de datos.
- Inicio de sesión utilizando usuarios locales o una API externa.
- Perfil de usuario con fotografía y nacionalidad.

### 📚 ESPE Academic

- Visualización de documentos académicos.
- Búsqueda por título o profesor.
- Filtros por carrera y materia.
- Ordenamiento por fecha, descargas y calificación.
- Crear, editar y eliminar documentos.

### ⚽ ESPE Deportes

- Gestión de eventos deportivos.
- Búsqueda por nombre o lugar.
- Filtros por deporte y fecha.
- Inscripción a eventos con confirmación.
- Estadísticas de participación.

### 🛒 ESPE Market

- Marketplace para compra y venta de productos.
- Búsqueda por nombre.
- Filtros por categoría y precio.
- Sistema de favoritos (Likes).
- Carrito de compras con persistencia.
- Gráficos estadísticos de productos.

### 👥 ESPE Members

- Compartir membresías digitales.
- Filtros por servicio y disponibilidad.
- Crear, editar y eliminar membresías.
- Visualización de cupos disponibles.

### 📊 Dashboard

- Estadísticas generales de la plataforma.
- Total de productos.
- Total de eventos.
- Total de documentos.
- Total de membresías.
- Categoría más popular.
- Precio promedio.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura de las páginas |
| CSS3 | Diseño y estilos |
| JavaScript (ES6+) | Lógica de la aplicación |
| Bootstrap 5 | Diseño responsivo |
| JSON | Datos iniciales |
| LocalStorage | Persistencia de información |
| Fetch API | Consumo de APIs |

---

## 📦 Librerías Utilizadas

| Librería | Finalidad |
|----------|-----------|
| Bootstrap 5 | Componentes y diseño responsivo |
| Font Awesome 6 | Iconografía |
| SweetAlert2 | Alertas personalizadas |
| Toastify | Notificaciones |
| Chart.js | Gráficos estadísticos |

---

## 🔌 APIs Consumidas

### DummyJSON - Usuarios

**URL**

```
https://dummyjson.com/users
```

**Uso**

- Autenticación de usuarios de prueba.

**Datos utilizados**

- username
- password
- firstName
- lastName
- image
- email
- address
- company

---

### DummyJSON - Miembros

**URL**

```
https://dummyjson.com/users?limit=8
```

**Uso**

- Mostrar miembros de la comunidad.

**Datos utilizados**

- firstName
- lastName
- image
- email
- address.city
- company.title

---

### Rest Countries

**URL**

```
https://restcountries.com/v3.1/name/{pais}?fields=flags
```

**Uso**

- Obtener la bandera correspondiente a la nacionalidad del usuario.

**Datos utilizados**

- flags.png

---

## 📁 Estructura del Proyecto

```text
Angola/
├── index.html
├── pages/
│   ├── Angola.html
│   ├── ESPEAcademic.html
│   ├── ESPEDeportes.html
│   ├── ESPEMarket.html
│   ├── ESPEMembers.html
│   └── registro.html
├── css/
│   ├── general.css
│   ├── angola.css
│   ├── ESPEAcademic.css
│   ├── ESPEDeportes.css
│   ├── ESPEMarket.css
│   ├── ESPEMembers.css
│   ├── login.css
│   └── registro.css
├── js/
│   ├── academico.js
│   ├── deportes.js
│   ├── market.js
│   ├── members.js
│   ├── miembros.js
│   ├── login.js
│   ├── registro.js
│   ├── perfil.js
│   ├── estadisticas.js
│   ├── paises.js
│   └── toast.js
├── json/
│   ├── categorias.json
│   ├── deportes.json
│   ├── eventos_deportivos.json
│   ├── membresias.json
│   ├── pdfs.json
│   └── productos.json
├── img/
├── video/
└── README.md
```

---

## 🚀 Instrucciones de Ejecución

### Requisitos

- Navegador moderno (Chrome, Edge, Firefox o Safari).
- Conexión a Internet para cargar librerías y APIs.

### 1. Clonar el repositorio

```bash
git clone https://github.com/ElkinVera17/EspeAngola_JS.git
```

O descargar el proyecto en formato ZIP.

### 2. Abrir la aplicación

- Abrir el archivo **index.html**.
- También puede utilizar la extensión **Live Server** de Visual Studio Code.

### 3. Iniciar sesión

#### Usuario de prueba

**Usuario**

```
emily.johnson
```

**Contraseña**

```
emilyspass
```

#### Registro

- Seleccionar **Registrarse**.
- Completar el formulario.
- Iniciar sesión con las credenciales creadas.

### 4. Explorar la plataforma

- Navegar por los cuatro módulos.
- Crear, editar y eliminar información.
- Utilizar filtros y buscadores.
- Agregar productos al carrito.

---

## 📌 Nota

Toda la información creada por el usuario se almacena en **LocalStorage**, por lo que los datos permanecen únicamente en el navegador donde se utiliza la aplicación.

En el módulo **ESPE Market** existe la opción **Restablecer datos**, que permite recuperar la información inicial.

---

## 🖼️ Capturas del Proyecto

### Página de Inicio

<img width="458" height="452" alt="Inicio" src="https://github.com/user-attachments/assets/fd065c00-1a02-4536-bc3f-342ff15a9244" />

### Página Principal

<img width="471" height="467" alt="Principal" src="https://github.com/user-attachments/assets/771a0a47-087d-4e12-abe6-b1e1ff1a75c1" />

---

## 🔗 Enlaces

### Sitio Web

https://elkinvera17.github.io/EspeAngola_JS/

### Repositorio

https://github.com/ElkinVera17/EspeAngola_JS

---

## 📝 Créditos

- **Desarrollador:** Elkin Vera
- **Institución:** Universidad de las Fuerzas Armadas ESPE
- **Sede:** Santo Domingo de los Tsáchilas
- **Año:** 2026

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos y educativos.

**© 2026 Elkin Vera. Todos los derechos reservados.**
