// secciones
// cada una tiene un slug (lo que va en la url y en la base)
// y un nombre (lo que ve el user)

export const SECCIONES = [
    { slug: "rock",        nombre: "Rock" },
    { slug: "pop",         nombre: "Pop" },
    { slug: "jazz",        nombre: "Jazz" },
    { slug: "electronica", nombre: "Electrónica" },
    { slug: "folklore",    nombre: "Folklore" }
]

// traduzco un slug al nombre lindo, lo uso en los titulos de las paginas
export function nombreDeSeccion(slug) {
    const seccion = SECCIONES.find(s => s.slug === slug)
    return seccion ? seccion.nombre : ""
}

// me dice si un slug existe, lo voy a usar para validar formularios
export function existeSeccion(slug) {
    return SECCIONES.some(s => s.slug === slug)
}