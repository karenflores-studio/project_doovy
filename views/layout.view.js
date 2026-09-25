// esqueleto html que comparten todas las paginas
// aca vive lo que se repite: el head, el menu y el pie

import { SECCIONES } from "../config/secciones.js"
import { esc } from "./helpers.js"

// menu de navegacion con las 5 secciones que pide la consigna
// seccionActiva sirve para marcar en que seccion estoy parada
function menu(seccionActiva) {
    // armo un link por cada seccion del archivo de configuracion
    const links = SECCIONES.map(s => `
        <li class="nav-item">
            <a class="nav-link ${s.slug === seccionActiva ? "active fw-bold" : ""}"
               href="/albumes?seccion=${s.slug}">${esc(s.nombre)}</a>
        </li>`).join("")

    return `
    <nav class="navbar navbar-expand-lg doovy-nav">
        <div class="container">
            <a class="navbar-brand" href="/">Doovy</a>
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link ${seccionActiva === "" ? "active fw-bold" : ""}"
                       href="/albumes">Todos</a>
                </li>
                ${links}
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link" href="/artistas">Artistas</a></li>
                <li class="nav-item"><a class="btn btn-primary btn-sm ms-2" href="/albumes/nuevo">+ Nuevo álbum</a></li>
            </ul>
        </div>
    </nav>`
}

// pie de pagina, por ahora simple
function pie() {
    return `
    <footer class="doovy-footer py-4 mt-5">
        <div class="container small">
            Doovy — Parcial 1 Aplicaciones Híbridas
        </div>
    </footer>`
}

// arma la pagina completa: recibe un titulo y el contenido ya armado
// todas las vistas terminan llamando a esta funcion
export function pagina(titulo, contenido, seccionActiva = "") {
    return `<!DOCTYPE html>
<html lang="es" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(titulo)} | Doovy</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css">
</head>
<body class="d-flex flex-column min-vh-100">
    ${menu(seccionActiva)}
    <main class="container py-4 flex-grow-1">
        ${contenido}
    </main>
    ${pie()}
</body>
</html>`
}

// pagina generica de error, la uso para el 404 y para fallas inesperadas
// vive aca y no en album.view porque la usan todas las secciones del sitio
export function paginaError(titulo, mensaje) {
    const html = `
    <div class="text-center py-5">
        <h1 class="display-5">${esc(titulo)}</h1>
        <p class="lead text-muted">${esc(mensaje)}</p>
        <a class="btn btn-primary mt-3" href="/albumes">Volver al listado</a>
    </div>`

    return pagina(titulo, html)
}