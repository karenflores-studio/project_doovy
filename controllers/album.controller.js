// controllers de albumes para la parte web
// leen el pedido, llaman al service y mandan la vista
// no consultan mongo ni arman html

import * as albumService from "../services/album.service.js"
import * as artistaService from "../services/artista.service.js"
import * as albumView from "../views/album.view.js"
import { paginaError } from "../views/layout.view.js"
import { limpiarAlbum, validarAlbum } from "../validators/album.validator.js"

// lo unico especifico del formulario html es que las canciones llegan
// como un texto con una cancion por linea, asi que las convierto a array
// del resto de la limpieza y los tipos se encarga el validador
function datosDelFormulario(body) {
    return {
        ...body,
        canciones: (body.canciones || "")
            .split("\n")
            .map(c => c.trim())
            .filter(c => c !== "")
    }
}

// listado de albumes, con los filtros que vengan en la url
export async function listar(req, res) {
    try {
        const albumes = await albumService.getAlbumes(req.query)
        const seccion = req.query.seccion || ""
        const busqueda = req.query.titulo || ""

        res.send(albumView.listadoAlbumes(albumes, seccion, busqueda))
    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo traer el listado."))
    }
}

// detalle de un album
// busco tambien su artista, asi la vista puede mostrar la relacion
export async function ver(req, res) {
    try {
        const album = await albumService.getAlbumById(req.params.id)

        if (!album) {
            return res.status(404).send(paginaError("404", "Ese álbum no existe."))
        }

        const artista = await artistaService.getArtistaById(album.artista_id)
        res.send(albumView.detalleAlbum(album, artista))

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo traer el álbum."))
    }
}

// muestro el formulario vacio
// necesito la lista de artistas para armar el select
export async function formularioNuevo(req, res) {
    try {
        const artistas = await artistaService.getArtistas()
        res.send(albumView.formularioAlbum({}, artistas))
    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo cargar el formulario."))
    }
}

// guardo el album nuevo
export async function crear(req, res) {
    try {
        const datos = limpiarAlbum(datosDelFormulario(req.body))
        const errores = validarAlbum(datos)

        // si hay errores vuelvo a mostrar el formulario con lo que ya habia cargado
        // asi la persona no pierde todo lo que escribio
        if (errores.length > 0) {
            const artistas = await artistaService.getArtistas()
            return res.status(400).send(
                albumView.formularioAlbum(datos, artistas, errores.join(" - "))
            )
        }

        // los albumes nuevos arrancan sin la marca de borrado
        datos.eliminado = false

        const album = await albumService.crearAlbum(datos)

        // redirijo al detalle en vez de mandar html directo
        res.redirect(`/albumes/${album._id}`)

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo guardar el álbum."))
    }
}

// muestro el formulario precargado con los datos del album
export async function formularioEditar(req, res) {
    try {
        const album = await albumService.getAlbumById(req.params.id)

        if (!album) {
            return res.status(404).send(paginaError("404", "Ese álbum no existe."))
        }

        const artistas = await artistaService.getArtistas()
        res.send(albumView.formularioAlbum(album, artistas))

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo cargar el formulario."))
    }
}

// guardo los cambios
export async function editar(req, res) {
    try {
        const datos = limpiarAlbum(datosDelFormulario(req.body))
        const errores = validarAlbum(datos)

        // si hay errores devuelvo el formulario con lo que habia cargado
        // le vuelvo a poner el _id porque limpiarAlbum lo descarta, y el formulario
        // lo necesita para saber que es una edicion y no un alta
        if (errores.length > 0) {
            const artistas = await artistaService.getArtistas()
            return res.status(400).send(
                albumView.formularioAlbum({ ...datos, _id: req.params.id }, artistas, errores.join(" - "))
            )
        }

        // uso actualizar y no reemplazar, asi no pierdo los campos que no estan en el form
        const album = await albumService.actualizarAlbum(req.params.id, datos)

        if (!album) {
            return res.status(404).send(paginaError("404", "Ese álbum no existe."))
        }

        res.redirect(`/albumes/${req.params.id}`)

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo editar el álbum."))
    }
}

// muestro la confirmacion antes de borrar
export async function formularioEliminar(req, res) {
    try {
        const album = await albumService.getAlbumById(req.params.id)

        if (!album) {
            return res.status(404).send(paginaError("404", "Ese álbum no existe."))
        }

        res.send(albumView.confirmarEliminar(album))

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo cargar la página."))
    }
}

// marco el album como eliminado, no lo saco de la base
export async function eliminar(req, res) {
    try {
        const album = await albumService.eliminarAlbum(req.params.id)

        if (!album) {
            return res.status(404).send(paginaError("404", "Ese álbum no existe."))
        }

        res.redirect("/albumes")

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo eliminar el álbum."))
    }
}