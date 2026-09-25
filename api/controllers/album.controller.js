// controllers de la api de albumes
// comparten el mismo service que la parte web, no duplican ninguna consulta

import * as albumService from "../../services/album.service.js"
import { limpiarAlbum, validarAlbum } from "../../validators/album.validator.js"

// GET /api/albumes
// trae todos, con los filtros opcionales que vengan en la query
export async function listar(req, res) {
    try {
        const albumes = await albumService.getAlbumes(req.query)
        res.status(200).json(albumes)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo obtener el listado de álbumes" })
    }
}

// GET /api/albumes/:id
export async function ver(req, res) {
    try {
        const album = await albumService.getAlbumById(req.params.id)

        // si el service me devuelve null, ese id no existe
        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" })
        }

        res.status(200).json(album)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo obtener el álbum" })
    }
}

// POST /api/albumes
// el body viene en json, asi que las canciones ya llegan como array
export async function crear(req, res) {
    try {
        // primero me quedo solo con los campos que el sistema necesita
        const datos = limpiarAlbum(req.body)

        // despues chequeo que esten todos y sean correctos
        const errores = validarAlbum(datos)
        if (errores.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", detalles: errores })
        }

        // esto no lo puede decidir el cliente, lo pone el servidor
        datos.eliminado = false

        const album = await albumService.crearAlbum(datos)

        // 201 significa "cree un recurso nuevo"
        res.status(201).json(album)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo crear el álbum" })
    }
}

// PUT /api/albumes/:id
// reemplaza el documento entero, los campos que no manden se pierden
export async function reemplazar(req, res) {
    try {
        const datos = limpiarAlbum(req.body)

        // como reemplaza el documento entero, exijo todos los campos
        const errores = validarAlbum(datos)
        if (errores.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", detalles: errores })
        }

        datos.eliminado = false

        const album = await albumService.reemplazarAlbum(req.params.id, datos)

        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" })
        }

        res.status(200).json(album)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo reemplazar el álbum" })
    }
}

// PATCH /api/albumes/:id
// actualiza solo los campos que mandan, el resto queda como estaba
export async function actualizar(req, res) {
    try {
        const datos = limpiarAlbum(req.body)

        // si despues de limpiar no quedo nada, no mandaron ningun campo valido
        if (Object.keys(datos).length === 0) {
            return res.status(400).json({ error: "No enviaste ningún campo válido para actualizar" })
        }

        // valido en modo parcial: solo los campos que vinieron
        const errores = validarAlbum(datos, true)
        if (errores.length > 0) {
            return res.status(400).json({ error: "Datos inválidos", detalles: errores })
        }

        const album = await albumService.actualizarAlbum(req.params.id, datos)

        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" })
        }

        res.status(200).json(album)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo actualizar el álbum" })
    }
}

// DELETE /api/albumes/:id
// borrado logico: lo marca como eliminado pero no lo saca de la base
export async function eliminar(req, res) {
    try {
        const album = await albumService.eliminarAlbum(req.params.id)

        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" })
        }

        res.status(200).json({
            mensaje: "Álbum eliminado",
            album
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "No se pudo eliminar el álbum" })
    }
}