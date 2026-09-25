// valida y limpia los datos de un album antes de guardarlos
// esta capa se asegura de que lo que manda el cliente sea lo que el sistema necesita

import { existeSeccion } from "../config/secciones.js"
import { FORMATO_ID, esUrl, tieneTexto } from "./comunes.js"

// me quedo solo con los campos que el sistema necesita (lista blanca)
// si el cliente manda campos de mas, o intenta tocar "eliminado", los ignoro
export function limpiarAlbum(datos = {}) {
    const limpio = {}

    if (datos.titulo !== undefined)      limpio.titulo = String(datos.titulo).trim()
    if (datos.descripcion !== undefined) limpio.descripcion = String(datos.descripcion).trim()
    if (datos.anio !== undefined)        limpio.anio = Number(datos.anio)
    if (datos.link !== undefined)        limpio.link = String(datos.link).trim()
    if (datos.img !== undefined)         limpio.img = String(datos.img).trim()
    if (datos.seccion !== undefined)     limpio.seccion = String(datos.seccion).trim()
    if (datos.artista_id !== undefined)  limpio.artista_id = String(datos.artista_id).trim()

    // las canciones tienen que ser un array de textos, sin elementos vacios
    if (datos.canciones !== undefined) {
        limpio.canciones = Array.isArray(datos.canciones)
            ? datos.canciones.map(c => String(c).trim()).filter(c => c !== "")
            : []
    }

    return limpio
}

// valida los datos de un album
// devuelve un array de errores, vacio si esta todo bien
// con parcial en true solo valida los campos que vinieron, lo uso para PATCH
export function validarAlbum(datos = {}, parcial = false) {
    const errores = []

    // en modo parcial solo reviso un campo si el cliente lo mando
    const revisar = campo => !parcial || datos[campo] !== undefined

    if (revisar("titulo")) {
        if (!tieneTexto(datos.titulo)) {
            errores.push("El título es obligatorio")
        } else if (datos.titulo.length > 120) {
            errores.push("El título no puede superar los 120 caracteres")
        }
    }

    if (revisar("descripcion")) {
        if (!tieneTexto(datos.descripcion)) {
            errores.push("La descripción es obligatoria")
        } else if (datos.descripcion.length > 500) {
            errores.push("La descripción no puede superar los 500 caracteres")
        }
    }

    if (revisar("anio")) {
        const maximo = new Date().getFullYear() + 1
        if (!Number.isInteger(datos.anio)) {
            errores.push("El año tiene que ser un número entero")
        } else if (datos.anio < 1900 || datos.anio > maximo) {
            errores.push(`El año tiene que estar entre 1900 y ${maximo}`)
        }
    }

    if (revisar("link")) {
        if (!esUrl(datos.link)) {
            errores.push("El link tiene que ser una URL válida que empiece con http o https")
        }
    }

    if (revisar("img")) {
        if (!esUrl(datos.img)) {
            errores.push("La imagen tiene que ser una URL válida que empiece con http o https")
        }
    }

    if (revisar("seccion")) {
        if (!existeSeccion(datos.seccion)) {
            errores.push("La sección no es válida")
        }
    }

    if (revisar("artista_id")) {
        if (!FORMATO_ID.test(datos.artista_id)) {
            errores.push("Tenés que elegir un artista válido")
        }
    }

    // las canciones son opcionales, pero si vienen tienen que ser una lista
    if (datos.canciones !== undefined && !Array.isArray(datos.canciones)) {
        errores.push("Las canciones tienen que ser una lista")
    }

    return errores
}
