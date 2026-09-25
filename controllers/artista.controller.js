// controllers de artistas para la parte web
// coordinan: leen el pedido, llaman a los services y mandan la vista

import * as artistaService from "../services/artista.service.js"
import * as albumService from "../services/album.service.js"
import * as artistaView from "../views/artista.view.js"
import { paginaError } from "../views/layout.view.js"
import { limpiarArtista, validarArtista } from "../validators/artista.validator.js"

// listado de todos los artistas
export async function listar(req, res) {
    try {
        const artistas = await artistaService.getArtistas()
        res.send(artistaView.listadoArtistas(artistas))
    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo traer los artistas."))
    }
}

// detalle de un artista junto con todos sus albumes
// aca uso los DOS services: uno para el artista y otro para sus albumes
export async function ver(req, res) {
    try {
        const artista = await artistaService.getArtistaById(req.params.id)

        if (!artista) {
            return res.status(404).send(paginaError("404", "Ese artista no existe."))
        }

        const albumes = await albumService.getAlbumesPorArtista(req.params.id)
        res.send(artistaView.detalleArtista(artista, albumes))

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo traer el artista."))
    }
}

// muestro el formulario de alta
export function formularioNuevo(req, res) {
    res.send(artistaView.formularioArtista())
}

// guardo el artista nuevo
export async function crear(req, res) {
    try {
        const datos = limpiarArtista(req.body)
        const errores = validarArtista(datos)

        // si hay errores devuelvo el formulario con lo que habia cargado
        if (errores.length > 0) {
            return res.status(400).send(
                artistaView.formularioArtista(datos, errores.join(" - "))
            )
        }

        datos.eliminado = false

        const artista = await artistaService.crearArtista(datos)

        // patron post/redirect/get: redirijo en vez de mandar html
        res.redirect(`/artistas/${artista._id}`)

    } catch (error) {
        console.error(error)
        res.status(500).send(paginaError("Error", "No se pudo guardar el artista."))
    }
}