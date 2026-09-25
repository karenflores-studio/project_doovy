// vistas de albumes
// no consultan la base, solo reciben los datos ya listos

import { pagina } from "./layout.view.js"
import { esc, lista } from "./helpers.js"
import { SECCIONES, nombreDeSeccion } from "../config/secciones.js"

// tarjeta de un album, se repite dentro del listado
function tarjeta(album) {
    return `
    <div class="col-12 col-md-6 col-lg-4">
        <article class="card h-100 shadow-sm">

            <img src="${esc(album.img)}" class="card-img-top" alt="Tapa de ${esc(album.titulo)}">

            <div class="card-body">
                <span class="badge text-bg-secondary mb-2">${esc(nombreDeSeccion(album.seccion))}</span>
                <h2 class="h5 card-title">
                    ${esc(album.titulo)}
                    <small class="text-muted">(${esc(album.anio)})</small>
                </h2>
                <p class="card-text">${esc(album.descripcion)}</p>
                <p class="card-text small text-muted">
                    <strong>Canciones:</strong> ${lista(album.canciones)}
                </p>
                <a href="${esc(album.link)}" target="_blank" rel="noopener">Escuchar</a>
            </div>

            <div class="card-footer d-flex gap-2">
                <a class="btn btn-sm btn-outline-primary" href="/albumes/${esc(album._id)}">Ver</a>
                <a class="btn btn-sm btn-outline-warning" href="/albumes/editar/${esc(album._id)}">Editar</a>
                <a class="btn btn-sm btn-outline-danger" href="/albumes/eliminar/${esc(album._id)}">Eliminar</a>
            </div>

        </article>
    </div>`
}

// buscador por titulo, es el segundo filtro que pide la consigna
function buscador(seccionActiva, busqueda) {
    return `
    <form class="row g-2 mb-4" method="GET" action="/albumes">
        <input type="hidden" name="seccion" value="${esc(seccionActiva)}">
        <div class="col-sm-8 col-md-6">
            <input class="form-control" type="search" name="titulo"
                   placeholder="Buscar por título..." value="${esc(busqueda)}">
        </div>
        <div class="col-auto">
            <button class="btn btn-primary" type="submit">Buscar</button>
        </div>
        <div class="col-auto">
            <a class="btn btn-outline-secondary" href="/albumes">Limpiar</a>
        </div>
    </form>`
}

// pagina del listado de albumes
// si viene una seccion, el titulo lo dice; si no, muestra todos
export function listadoAlbumes(albumes, seccionActiva = "", busqueda = "") {

    const titulo = seccionActiva
        ? `Álbumes de ${nombreDeSeccion(seccionActiva)}`
        : "Todos los álbumes"

    // si no hay resultados muestro un aviso en vez de una grilla vacia
    const contenido = albumes.length === 0
        ? `<div class="alert alert-info">No se encontraron álbumes con ese criterio.</div>`
        : `<div class="row g-4">${albumes.map(a => tarjeta(a)).join("")}</div>`

    const html = `
        <h1 class="mb-1">${esc(titulo)}</h1>
        <p class="text-muted">${albumes.length} resultado(s)</p>
        ${buscador(seccionActiva, busqueda)}
        ${contenido}`

    return pagina(titulo, html, seccionActiva)
}

// pagina de detalle de un album
// recibe tambien el artista, asi muestro la relacion entre las dos colecciones
export function detalleAlbum(album, artista) {

    // si el album tiene artista muestro su ficha, si no aviso que no tiene
    const fichaArtista = artista
        ? `
        <div class="card mb-3">
            <div class="row g-0 align-items-center">
                <div class="col-auto">
                    <img src="${esc(artista.foto)}" alt="${esc(artista.nombre)}"
                         width="90" height="90" class="rounded-start object-fit-cover">
                </div>
                <div class="col">
                    <div class="card-body py-2">
                        <h3 class="h6 mb-1">${esc(artista.nombre)}</h3>
                        <p class="small text-muted mb-1">${esc(artista.descripcion)}</p>
                        <a class="small" href="/artistas/${esc(artista._id)}">Ver todos sus álbumes</a>
                    </div>
                </div>
            </div>
        </div>`
        : `<div class="alert alert-warning">Este álbum no tiene artista asignado.</div>`

    // armo la lista de canciones como items de una lista numerada
    const canciones = (album.canciones || [])
        .map(c => `<li class="list-group-item">${esc(c)}</li>`)
        .join("")

    const html = `
    <div class="row g-4">

        <div class="col-md-5">
            <img src="${esc(album.img)}" alt="Tapa de ${esc(album.titulo)}"
                 class="img-fluid rounded shadow-sm">
        </div>

        <div class="col-md-7">
            <span class="badge text-bg-secondary mb-2">${esc(nombreDeSeccion(album.seccion))}</span>
            <h1>${esc(album.titulo)}</h1>
            <p class="text-muted">Año: ${esc(album.anio)}</p>
            <p>${esc(album.descripcion)}</p>

            <a class="btn btn-success mb-3" href="${esc(album.link)}" target="_blank" rel="noopener">
                Escuchar
            </a>

            ${fichaArtista}

            <h2 class="h6 mt-4">Canciones</h2>
            <ol class="list-group list-group-numbered mb-4">${canciones}</ol>

            <div class="d-flex gap-2">
                <a class="btn btn-outline-warning" href="/albumes/editar/${esc(album._id)}">Editar</a>
                <a class="btn btn-outline-danger" href="/albumes/eliminar/${esc(album._id)}">Eliminar</a>
                <a class="btn btn-link" href="/albumes">← Volver</a>
            </div>
        </div>

    </div>`

    return pagina(album.titulo, html, album.seccion)
}


// un solo formulario para crear y para editar
// si le paso un album con _id sabe que es edicion, si no es alta
// asi no duplico los campos en dos funciones distintas
export function formularioAlbum(album = {}, artistas = [], error = "") {

    const esEdicion = Boolean(album._id)
    const accion = esEdicion ? `/albumes/editar/${esc(album._id)}` : "/albumes/nuevo"
    const titulo = esEdicion ? `Editar: ${album.titulo}` : "Nuevo álbum"

    // armo las opciones del select de secciones, marcando la que ya tiene
    const opcionesSeccion = SECCIONES.map(s => `
        <option value="${esc(s.slug)}" ${s.slug === album.seccion ? "selected" : ""}>
            ${esc(s.nombre)}
        </option>`).join("")

    // lo mismo con el select de artistas
    const opcionesArtista = artistas.map(a => `
        <option value="${esc(a._id)}" ${String(a._id) === String(album.artista_id) ? "selected" : ""}>
            ${esc(a.nombre)}
        </option>`).join("")

    // si el controller me manda un error de validacion lo muestro arriba del formulario
    const aviso = error
        ? `<div class="alert alert-danger">${esc(error)}</div>`
        : ""

    const html = `
    <h1 class="mb-4">${esc(titulo)}</h1>
    ${aviso}

    <form method="POST" action="${accion}" class="row g-3">

        <div class="col-md-8">
            <label class="form-label" for="titulo">Título *</label>
            <input class="form-control" id="titulo" name="titulo" required
                   value="${esc(album.titulo)}">
        </div>

        <div class="col-md-4">
            <label class="form-label" for="anio">Año *</label>
            <input class="form-control" id="anio" name="anio" type="number" required
                   min="1900" max="2100" value="${esc(album.anio)}">
        </div>

        <div class="col-12">
            <label class="form-label" for="descripcion">Descripción *</label>
            <textarea class="form-control" id="descripcion" name="descripcion" rows="2"
                      required>${esc(album.descripcion)}</textarea>
        </div>

        <div class="col-12">
            <label class="form-label" for="canciones">Canciones</label>
            <textarea class="form-control" id="canciones" name="canciones" rows="4"
                      placeholder="Una canción por línea">${esc((album.canciones || []).join("\n"))}</textarea>
            <div class="form-text">Escribí una canción por línea.</div>
        </div>

        <div class="col-md-6">
            <label class="form-label" for="link">Link para escuchar *</label>
            <input class="form-control" id="link" name="link" type="url" required
                   placeholder="https://..." value="${esc(album.link)}">
        </div>

        <div class="col-md-6">
            <label class="form-label" for="img">Imagen (URL) *</label>
            <input class="form-control" id="img" name="img" type="url" required
                   placeholder="https://picsum.photos/seed/algo/400/225" value="${esc(album.img)}">
        </div>

        <div class="col-md-6">
            <label class="form-label" for="seccion">Sección *</label>
            <select class="form-select" id="seccion" name="seccion" required>
                <option value="">Elegí una sección...</option>
                ${opcionesSeccion}
            </select>
        </div>

        <div class="col-md-6">
            <label class="form-label" for="artista_id">Artista *</label>
            <select class="form-select" id="artista_id" name="artista_id" required>
                <option value="">Elegí un artista...</option>
                ${opcionesArtista}
            </select>
        </div>

        <div class="col-12 d-flex gap-2 mt-3">
            <button class="btn btn-primary" type="submit">Guardar</button>
            <a class="btn btn-outline-secondary" href="/albumes">Cancelar</a>
        </div>

    </form>`

    return pagina(titulo, html)
}

// pagina de confirmacion antes de eliminar
// muestro los datos para que la persona vea bien que esta por borrar
export function confirmarEliminar(album) {

    const html = `
    <div class="alert alert-danger">
        <h1 class="h4">¿Eliminar este álbum?</h1>
        <p class="mb-0">Esta acción lo saca del listado.</p>
    </div>

    <div class="card mb-4">
        <div class="row g-0">
            <div class="col-auto">
                <img src="${esc(album.img)}" alt="" width="200" class="rounded-start">
            </div>
            <div class="col">
                <div class="card-body">
                    <h2 class="h5">${esc(album.titulo)} <small class="text-muted">(${esc(album.anio)})</small></h2>
                    <p class="mb-1">${esc(album.descripcion)}</p>
                    <p class="small text-muted mb-0">
                        Sección: ${esc(nombreDeSeccion(album.seccion))} ·
                        ${(album.canciones || []).length} canciones
                    </p>
                </div>
            </div>
        </div>
    </div>

    <form method="POST" action="/albumes/eliminar/${esc(album._id)}" class="d-flex gap-2">
        <button class="btn btn-danger" type="submit">Sí, eliminar</button>
        <a class="btn btn-outline-secondary" href="/albumes/${esc(album._id)}">Cancelar</a>
    </form>`

    return pagina(`Eliminar ${album.titulo}`, html)
}


// pagina de inicio con el menu 
// cada tarjeta lleva al listado filtrado por esa seccion
export function inicio() {

    const tarjetas = SECCIONES.map(s => `
        <div class="col-6 col-md-4">
            <a class="card doovy-seccion h-100 text-center text-decoration-none" href="/albumes?seccion=${esc(s.slug)}">
                <div class="card-body py-5">
                    <h2 class="h4 mb-0">${esc(s.nombre)}</h2>
                </div>
            </a>
        </div>`).join("")

    const html = `
    <div class="doovy-hero text-center">
        <h1>Doovy</h1>
        <p class="lead text-muted">Catálogo de álbumes por género</p>
    </div>

    <div class="row g-3 justify-content-center">
        ${tarjetas}
        <div class="col-6 col-md-4">
            <a class="card doovy-seccion h-100 text-center text-decoration-none" href="/albumes">
                <div class="card-body py-5">
                    <h2 class="h4 mb-0">Ver todos</h2>
                </div>
            </a>
        </div>
    </div>`

    // le paso "inicio" para que no quede ninguna pastilla del menu marcada
    return pagina("Inicio", html, "inicio")
}