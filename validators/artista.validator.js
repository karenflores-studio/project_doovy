// valida y limpia los datos de un artista antes de guardarlos

import { esUrl, tieneTexto } from "./comunes.js"

// me quedo solo con los campos que el sistema necesita (lista blanca)
export function limpiarArtista(datos = {}) {
    const limpio = {}

    if (datos.nombre !== undefined)      limpio.nombre = String(datos.nombre).trim()
    if (datos.foto !== undefined)        limpio.foto = String(datos.foto).trim()
    if (datos.descripcion !== undefined) limpio.descripcion = String(datos.descripcion).trim()
    if (datos.pais !== undefined)        limpio.pais = String(datos.pais).trim()

    return limpio
}

// valida los datos de un artista
// devuelve un array de errores, vacio si esta todo bien
export function validarArtista(datos = {}, parcial = false) {
    const errores = []

    const revisar = campo => !parcial || datos[campo] !== undefined

    // nombre, foto y descripcion son los tres campos que pide la consigna
    if (revisar("nombre")) {
        if (!tieneTexto(datos.nombre)) {
            errores.push("El nombre es obligatorio")
        } else if (datos.nombre.length > 100) {
            errores.push("El nombre no puede superar los 100 caracteres")
        }
    }

    if (revisar("foto")) {
        if (!esUrl(datos.foto)) {
            errores.push("La foto tiene que ser una URL válida que empiece con http o https")
        }
    }

    if (revisar("descripcion")) {
        if (!tieneTexto(datos.descripcion)) {
            errores.push("La descripción es obligatoria")
        } else if (datos.descripcion.length > 500) {
            errores.push("La descripción no puede superar los 500 caracteres")
        }
    }

    // el pais es opcional, pero si viene le pongo un limite
    if (tieneTexto(datos.pais) && datos.pais.length > 60) {
        errores.push("El país no puede superar los 60 caracteres")
    }

    return errores
}
