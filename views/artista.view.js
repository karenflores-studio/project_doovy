// vistas de artistas

import { pagina } from "./layout.view.js"
import { esc } from "./helpers.js"

// tarjeta de un artista dentro del listado
function tarjeta(artista) {
    return `
    <div class="col-12 col-lg-6">
        <article class="card h-100 shadow-sm">
            <div class="row g-0">
                <div class="col-auto">
                    <img src="${esc(artista.foto)}" alt="Foto de ${esc(artista.nombre)}"
                         width="130" height="130" class="rounded-start object-fit-cover">
                </div>
                <div class="col">
                    <div class="card-body">
                        <h2 class="h6 mb-1">${esc(artista.nombre)}</h2>
                        <p class="small text-muted mb-1">${esc(artista.pais)}</p>
                        <p class="small mb-2">${esc(artista.descripcion)}</p>
                        <a class="btn btn-sm btn-outline-primary"
                           href="/artistas/${esc(artista._id)}">Ver sus álbumes</a>
                    </div>
                </div>
            </div>
        </article>
    </div>`
}

// listado de todos los artistas
export function listadoArtistas(artistas) {

    const contenido = artistas.length === 0
        ? `<div class="alert alert-info">Todavía no hay artistas cargados.</div>`
        : `<div class="row g-4">${artistas.map(a => tarjeta(a)).join("")}</div>`

    const html = `
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h1 class="mb-0">Artistas</h1>
            <p class="text-muted mb-0">${artistas.length} artista(s)</p>
        </div>
        <a class="btn btn-primary" href="/artistas/nuevo">+ Nuevo artista</a>
    </div>
    ${contenido}`

    return pagina("Artistas", html)
}

// detalle de un artista con todos sus albumes
// esta pagina es la relacion entre las dos colecciones vista desde el otro lado
export function detalleArtista(artista, albumes) {

    // si el artista no tiene albumes lo aviso en vez de mostrar una grilla vacia
    const listaAlbumes = albumes.length === 0
        ? `<div class="alert alert-secondary">Este artista todavía no tiene álbumes cargados.</div>`
        : `<div class="row g-3">` + albumes.map(a => `
            <div class="col-6 col-md-4 col-lg-3">
                <a class="card h-100 text-decoration-none" href="/albumes/${esc(a._id)}">
                    <img src="${esc(a.img)}" class="card-img-top" alt="Tapa de ${esc(a.titulo)}">
                    <div class="card-body p-2">
                        <p class="small mb-0 fw-semibold">${esc(a.titulo)}</p>
                        <p class="small text-muted mb-0">${esc(a.anio)}</p>
                    </div>
                </a>
            </div>`).join("") + `</div>`

    const html = `
    <div class="card mb-4">
        <div class="row g-0 align-items-center">
            <div class="col-auto">
                <img src="${esc(artista.foto)}" alt="Foto de ${esc(artista.nombre)}"
                     width="160" height="160" class="rounded-start object-fit-cover">
            </div>
            <div class="col">
                <div class="card-body">
                    <h1 class="h3 mb-1">${esc(artista.nombre)}</h1>
                    <p class="text-muted mb-2">${esc(artista.pais)}</p>
                    <p class="mb-0">${esc(artista.descripcion)}</p>
                </div>
            </div>
        </div>
    </div>

    <h2 class="h5 mb-3">Álbumes (${albumes.length})</h2>
    ${listaAlbumes}

    <a class="btn btn-link mt-4" href="/artistas">← Volver a artistas</a>`

    return pagina(artista.nombre, html)
}

// formulario para dar de alta un artista
export function formularioArtista(artista = {}, error = "") {

    const aviso = error
        ? `<div class="alert alert-danger">${esc(error)}</div>`
        : ""

    const html = `
    <h1 class="mb-4">Nuevo artista</h1>
    ${aviso}

    <form method="POST" action="/artistas/nuevo" class="row g-3">

        <div class="col-md-8">
            <label class="form-label" for="nombre">Nombre *</label>
            <input class="form-control" id="nombre" name="nombre" required
                   value="${esc(artista.nombre)}">
        </div>

        <div class="col-md-4">
            <label class="form-label" for="pais">País</label>
            <input class="form-control" id="pais" name="pais" value="${esc(artista.pais)}">
        </div>

        <div class="col-12">
            <label class="form-label" for="foto">Foto (URL) *</label>
            <input class="form-control" id="foto" name="foto" type="url" required
                   placeholder="https://picsum.photos/seed/algo/300/300" value="${esc(artista.foto)}">
        </div>

        <div class="col-12">
            <label class="form-label" for="descripcion">Descripción *</label>
            <textarea class="form-control" id="descripcion" name="descripcion" rows="3"
                      required>${esc(artista.descripcion)}</textarea>
        </div>

        <div class="col-12 d-flex gap-2 mt-3">
            <button class="btn btn-primary" type="submit">Guardar</button>
            <a class="btn btn-outline-secondary" href="/artistas">Cancelar</a>
        </div>

    </form>`

    return pagina("Nuevo artista", html)
}