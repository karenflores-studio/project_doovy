// capa de servicios de albumes
// aca vive toda la logica que habla con mongo
// no sabe nada de html ni de req/res, solo de datos

import { ObjectId } from "mongodb"
import { db, esIdValido } from "../config/db.js"

// convierto el artista_id a ObjectId si me llega como texto
// el formulario html manda todo como string, pero en la base tiene que ser ObjectId
// si no, la relacion entre las dos colecciones no matchea
function normalizar(album) {
    const copia = { ...album }

    if (typeof copia.artista_id === "string" && esIdValido(copia.artista_id)) {
        copia.artista_id = new ObjectId(copia.artista_id)
    }

    return copia
}

// guardo el nombre de la coleccion en una constante
// asi si algun dia lo cambio, lo toco en un solo lugar
const COLECCION = "albumes"

// traigo todos los albumes, con filtros opcionales
// la usan el listado web, el menu de secciones y la api
export async function getAlbumes(filtros = {}) {

    // arranco pidiendo solo los que no estan borrados logicamente
    const filtro = { eliminado: { $ne: true } }

    // filtro 1: por seccion, coincidencia exacta con el slug
    if (filtros.seccion) {
        filtro.seccion = filtros.seccion
    }

    // filtro 2: por titulo, busqueda parcial que ignora mayusculas
    if (filtros.titulo) {
        filtro.titulo = { $regex: filtros.titulo, $options: "i" }
    }

    // orden: por defecto del mas nuevo al mas viejo
    const campoOrden = filtros.orden || "anio"
    const direccion = filtros.dir === "asc" ? 1 : -1

    // paginacion: si no me piden nada, traigo los primeros 12
    const pagina = parseInt(filtros.pagina) || 1
    const limite = parseInt(filtros.limite) || 12
    const saltear = (pagina - 1) * limite

    return await db.collection(COLECCION)
        .find(filtro)
        .sort({ [campoOrden]: direccion })
        .skip(saltear)
        .limit(limite)
        .toArray()
}

// traigo un album por su id
export async function getAlbumById(id) {
    // si el id tiene mal formato ni consulto, devuelvo null
    if (!esIdValido(id)) return null

    return await db.collection(COLECCION).findOne({ _id: new ObjectId(id) })
}

// traigo todos los albumes de un artista
export async function getAlbumesPorArtista(artistaId) {
    if (!esIdValido(artistaId)) return []

    return await db.collection(COLECCION)
        .find({
            artista_id: new ObjectId(artistaId),
            eliminado: { $ne: true }
        })
        .sort({ anio: -1 })
        .toArray()
}

// creo un album nuevo
export async function crearAlbum(album) {
    const datos = normalizar(album)
    const resultado = await db.collection(COLECCION).insertOne(datos)

    // insertOne no me devuelve el documento, solo el id que genero
    return { _id: resultado.insertedId, ...datos }
}

// reemplazo el album entero, es lo que usa PUT
// ojo: los campos que no me manden se pierden
export async function reemplazarAlbum(id, album) {
    if (!esIdValido(id)) return null

    const datos = normalizar(album)
    const resultado = await db.collection(COLECCION).replaceOne(
        { _id: new ObjectId(id) },
        datos
    )

    if (resultado.matchedCount === 0) return null

    return { _id: new ObjectId(id), ...datos }
}

// actualizo solo los campos que me mandan, es lo que usa PATCH
// los demas campos quedan como estaban
export async function actualizarAlbum(id, cambios) {
    if (!esIdValido(id)) return null

    const resultado = await db.collection(COLECCION).updateOne(
        { _id: new ObjectId(id) },
        { $set: normalizar(cambios) }
    )

    if (resultado.matchedCount === 0) return null

    return await getAlbumById(id)
}


// borrado logico: no lo saco de la base, solo lo marco como eliminado
// asi se puede recuperar y no se rompen las referencias
export async function eliminarAlbum(id) {
    if (!esIdValido(id)) return null

    // busco el album antes de marcarlo, asi puedo devolverlo como estaba
    const album = await getAlbumById(id)
    if (!album) return null

    await db.collection(COLECCION).updateOne(
        { _id: new ObjectId(id) },
        { $set: { eliminado: true } }
    )

    return album
}