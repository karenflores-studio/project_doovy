// funciones de validacion que comparten todos los validadores
//  ObjectId =24 caracteres hexadecimales
export const FORMATO_ID = /^[0-9a-fA-F]{24}$/

// chequeo que el texto sea una url http o https de verdad
export function esUrl(valor) {
    try {
        const url = new URL(valor)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

// chequeo que sea un texto con contenido, no vacio ni solo espacios
export function tieneTexto(valor) {
    return typeof valor === "string" && valor.trim() !== ""
}
