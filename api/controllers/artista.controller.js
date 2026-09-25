// controllers de la api de artistas

import * as artistaService from "../../services/artista.service.js"
import * as albumService from "../../services/album.service.js"
import { limpiarArtista, validarArtista } from "../../validators/artista.validator.js"

// GET /api/artistas
//obtener todos
export async function listar(req, res) {
    try {
        const artistas = await artistaService.getArtistas()
        res.status(200).json(artistas)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo obtener el listado de artistas" })
    }
}

// GET /api/artistas/:id
export async function ver(req, res) {
    try {
        const artista = await artistaService.getArtistaById(req.params.id)

        if (!artista) {
            return res.status(404).json({ error: "Artista no encontrado" })
        }

        res.status(200).json(artista)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo obtener el artista" })
    }
}

// POST /api/artistas
// crear
export async function crear(req, res) {
    try {
        // me quedo solo con los campos que el sistema necesita
        const datos = limpiarArtista(req.body)

        // chequeo que esten todos y sean correctos
        const errores = validarArtista(datos)
        if (errores.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", detalles: errores })
        }

        // esto no lo puede decidir el cliente, lo pone el servidor
        datos.eliminado = false

        const artista = await artistaService.crearArtista(datos)

        res.status(201).json(artista)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo crear el artista" })
    }
}

// GET /api/artistas/:id/albumes
//obtener todos los items que pertenecen a uno en particular
export async function albumesDelArtista(req, res) {
    try {
        // primero verifico que el artista exista, asi puedo distinguir
        // "no existe el artista" de "existe pero no tiene albumes"
        const artista = await artistaService.getArtistaById(req.params.id)

        if (!artista) {
            return res.status(404).json({ error: "Artista no encontrado" })
        }

        const albumes = await albumService.getAlbumesPorArtista(req.params.id)

        // devuelvo tambien los datos del artista, asi quien consume la api
        // no tiene que hacer un segundo pedido para saber de quien son
        res.status(200).json({
            artista,
            total: albumes.length,
            albumes
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo obtener los álbumes del artista" })
    }
}