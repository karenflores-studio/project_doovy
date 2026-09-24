// capa de servicios de artistas

import { ObjectId } from "mongodb"
import { db, esIdValido } from "../config/db.js"

const COLECCION = "artistas"

// traigo todos los artistas ordenados alfabeticamente
export async function getArtistas() {
    return await db.collection(COLECCION)
        .find({ eliminado: { $ne: true } })
        .sort({ nombre: 1 })
        .toArray()
}

// traigo un artista por su id
export async function getArtistaById(id) {
    if (!esIdValido(id)) return null

    return await db.collection(COLECCION).findOne({ _id: new ObjectId(id) })
}

// creo un artista nuevo
export async function crearArtista(artista) {
    const resultado = await db.collection(COLECCION).insertOne(artista)
    return { _id: resultado.insertedId, ...artista }
}