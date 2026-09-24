// funciones chicas de ayuda para las vistas

// escapo el html para que un dato guardado no pueda inyectar codigo en la pagina
// si alguien crea un album llamado <script>alert(1)</script>, se muestra como texto y no se ejecuta
export function esc(valor) {
    // si el dato no existe devuelvo string vacio en vez de "undefined"
    if (valor === null || valor === undefined) return ""

    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")
}

// convierto un array en texto separado por comas, lo uso para las canciones
export function lista(valores) {
    if (!Array.isArray(valores)) return ""
    return valores.map(v => esc(v)).join(", ")
}