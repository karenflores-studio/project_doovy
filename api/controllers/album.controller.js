// controllers de la api de albumes
// comparten el mismo service que la parte web, no duplican ninguna consulta

import * as albumService from "../../services/album.service.js"
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
        const album = await albumService.crearAlbum({
            ...req.body,
            eliminado: false
        })

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
        const album = await albumService.reemplazarAlbum(req.params.id, req.body)

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
        const album = await albumService.actualizarAlbum(req.params.id, req.body)

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