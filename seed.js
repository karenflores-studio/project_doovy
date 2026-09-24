// script para cargar datos de prueba en la base
// corre con: npm run seed
// borra todo lo que haya y carga de nuevo, asi lo puedo correr las veces que quiera

import { db, conectarBase, cerrarBase } from "./config/db.js"

// artistas van primero porque los albumes necesitan su _id para la relacion
const artistas = [
    {
        nombre: "Luis Alberto Spinetta",
        foto: "https://picsum.photos/seed/spinetta/300/300",
        descripcion: "Músico y compositor argentino, referente ineludible del rock nacional.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Soda Stereo",
        foto: "https://picsum.photos/seed/soda/300/300",
        descripcion: "Trío argentino que marcó el rock latinoamericano de los años 80 y 90.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Gustavo Cerati",
        foto: "https://picsum.photos/seed/cerati/300/300",
        descripcion: "Cantante y productor argentino, explorador del cruce entre rock y electrónica.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Mercedes Sosa",
        foto: "https://picsum.photos/seed/sosa/300/300",
        descripcion: "La voz de América Latina, referente del folklore y la canción comprometida.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Bill Evans",
        foto: "https://picsum.photos/seed/evans/300/300",
        descripcion: "Pianista estadounidense que redefinió el sonido del trío de jazz moderno.",
        pais: "Estados Unidos",
        eliminado: false
    },
    {
        nombre: "Miranda!",
        foto: "https://picsum.photos/seed/miranda/300/300",
        descripcion: "Dúo argentino de pop electrónico surgido a comienzos de los 2000.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Wos",
        foto: "https://picsum.photos/seed/wos/300/300",
        descripcion: "Rapero y cantautor argentino de la nueva escena.",
        pais: "Argentina",
        eliminado: false
    }
]

async function cargarDatos() {
    await conectarBase()

    // limpio las dos colecciones para no duplicar si corro el script mas de una vez
    await db.collection("artistas").deleteMany({})
    await db.collection("albumes").deleteMany({})
    console.log("colecciones limpias")

    // inserto los artistas y me guardo los ids que genero mongo
    const resultado = await db.collection("artistas").insertMany(artistas)
    console.log(`${resultado.insertedCount} artistas cargados`)

    // insertedIds viene numerado segun el orden del array de arriba
    // les pongo nombre para que los albumes se lean mas facil
    const ids = resultado.insertedIds
    const idSpinetta = ids[0]
    const idSoda     = ids[1]
    const idCerati   = ids[2]
    const idSosa     = ids[3]
    const idEvans    = ids[4]
    const idMiranda  = ids[5]

    // los albumes se arman aca adentro porque recien ahora tengo los ids de los artistas
    const albumes = [
        // ---------- rock ----------
        {
            titulo: "Artaud",
            descripcion: "Disco bisagra del rock argentino, editado bajo el nombre Pescado Rabioso.",
            canciones: ["Todas las hojas son del viento", "Cantata de puentes amarillos", "Bajan"],
            anio: 1973,
            link: "https://open.spotify.com/search/Artaud%20Spinetta",
            img: "https://picsum.photos/seed/artaud/400/225",
            seccion: "rock",
            artista_id: idSpinetta,
            eliminado: false
        },
        {
            titulo: "Canción Animal",
            descripcion: "El disco más rockero de Soda Stereo y uno de los más vendidos de la banda.",
            canciones: ["De música ligera", "Un millón de años luz", "Té para tres"],
            anio: 1990,
            link: "https://open.spotify.com/search/Cancion%20Animal",
            img: "https://picsum.photos/seed/cancionanimal/400/225",
            seccion: "rock",
            artista_id: idSoda,
            eliminado: false
        },
        {
            titulo: "Signos",
            descripcion: "Tercer álbum de Soda Stereo, el que los consolidó en toda Latinoamérica.",
            canciones: ["Prófugos", "Persiana americana", "En camino"],
            anio: 1986,
            link: "https://open.spotify.com/search/Signos%20Soda%20Stereo",
            img: "https://picsum.photos/seed/signos/400/225",
            seccion: "rock",
            artista_id: idSoda,
            eliminado: false
        },

        // ---------- pop ----------
        {
            titulo: "Sin Restricciones",
            descripcion: "Debut de Miranda! que definió el sonido del pop electrónico argentino.",
            canciones: ["Don", "Yo te diré", "Bailarina"],
            anio: 2002,
            link: "https://open.spotify.com/search/Sin%20Restricciones%20Miranda",
            img: "https://picsum.photos/seed/sinrestricciones/400/225",
            seccion: "pop",
            artista_id: idMiranda,
            eliminado: false
        },
        {
            titulo: "Es Mentira",
            descripcion: "Segundo disco de Miranda!, con sus canciones más conocidas.",
            canciones: ["Perfecta", "Traición", "Uno los dos"],
            anio: 2005,
            link: "https://open.spotify.com/search/Es%20Mentira%20Miranda",
            img: "https://picsum.photos/seed/esmentira/400/225",
            seccion: "pop",
            artista_id: idMiranda,
            eliminado: false
        },
        {
            titulo: "El Disco de Tu Corazón",
            descripcion: "Tercer álbum del dúo, con una producción más ambiciosa.",
            canciones: ["Prisionero", "Enamorada", "Navidad"],
            anio: 2007,
            link: "https://open.spotify.com/search/El%20Disco%20de%20Tu%20Corazon",
            img: "https://picsum.photos/seed/discocorazon/400/225",
            seccion: "pop",
            artista_id: idMiranda,
            eliminado: false
        },

        // ---------- jazz ----------
        {
            titulo: "Waltz for Debby",
            descripcion: "Grabado en vivo en el Village Vanguard, un clásico absoluto del piano jazz.",
            canciones: ["My Foolish Heart", "Waltz for Debby", "Detour Ahead"],
            anio: 1961,
            link: "https://open.spotify.com/search/Waltz%20for%20Debby",
            img: "https://picsum.photos/seed/waltzdebby/400/225",
            seccion: "jazz",
            artista_id: idEvans,
            eliminado: false
        },
        {
            titulo: "Portrait in Jazz",
            descripcion: "Primer disco del trío legendario de Bill Evans.",
            canciones: ["Autumn Leaves", "Blue in Green", "Peri's Scope"],
            anio: 1960,
            link: "https://open.spotify.com/search/Portrait%20in%20Jazz",
            img: "https://picsum.photos/seed/portraitjazz/400/225",
            seccion: "jazz",
            artista_id: idEvans,
            eliminado: false
        },
        {
            titulo: "Explorations",
            descripcion: "Disco de estudio del trío, con una interacción rítmica muy libre.",
            canciones: ["Israel", "Haunted Heart", "Beautiful Love"],
            anio: 1961,
            link: "https://open.spotify.com/search/Explorations%20Bill%20Evans",
            img: "https://picsum.photos/seed/explorations/400/225",
            seccion: "jazz",
            artista_id: idEvans,
            eliminado: false
        },

        // ---------- electronica ----------
        {
            titulo: "Bocanada",
            descripcion: "Segundo disco solista de Cerati, construido sobre samples y texturas.",
            canciones: ["Puente", "Raíz", "Paseo inmoral"],
            anio: 1999,
            link: "https://open.spotify.com/search/Bocanada",
            img: "https://picsum.photos/seed/bocanada/400/225",
            seccion: "electronica",
            artista_id: idCerati,
            eliminado: false
        },
        {
            titulo: "Siempre Es Hoy",
            descripcion: "El disco más experimental y electrónico de su etapa solista.",
            canciones: ["Cosas imposibles", "Artefacto", "Karaoke"],
            anio: 2002,
            link: "https://open.spotify.com/search/Siempre%20Es%20Hoy",
            img: "https://picsum.photos/seed/siempreeshoy/400/225",
            seccion: "electronica",
            artista_id: idCerati,
            eliminado: false
        },
        {
            titulo: "Fuerza Natural",
            descripcion: "Último álbum de estudio de Cerati, con un giro hacia lo acústico y el blues.",
            canciones: ["Déjà vu", "Rapto", "Magia"],
            anio: 2009,
            link: "https://open.spotify.com/search/Fuerza%20Natural",
            img: "https://picsum.photos/seed/fuerzanatural/400/225",
            seccion: "electronica",
            artista_id: idCerati,
            eliminado: false
        },

        // ---------- folklore ----------
        {
            titulo: "Mujeres Argentinas",
            descripcion: "Obra de Ariel Ramírez y Félix Luna interpretada por Mercedes Sosa.",
            canciones: ["Alfonsina y el mar", "Juana Azurduy", "Dorotea la cautiva"],
            anio: 1969,
            link: "https://open.spotify.com/search/Mujeres%20Argentinas",
            img: "https://picsum.photos/seed/mujeresargentinas/400/225",
            seccion: "folklore",
            artista_id: idSosa,
            eliminado: false
        },
        {
            titulo: "Cantora 1",
            descripcion: "Disco de duetos grabado en los últimos años de su carrera.",
            canciones: ["Zona de promesas", "Razón de vivir", "La maza"],
            anio: 2009,
            link: "https://open.spotify.com/search/Cantora%201",
            img: "https://picsum.photos/seed/cantora/400/225",
            seccion: "folklore",
            artista_id: idSosa,
            eliminado: false
        },
        {
            titulo: "Kamikaze",
            descripcion: "Disco acústico e íntimo de Spinetta, cercano a la canción de raíz folklórica.",
            canciones: ["Barro tal vez", "Seguir viviendo sin tu amor", "Quedándote o yéndote"],
            anio: 1982,
            link: "https://open.spotify.com/search/Kamikaze%20Spinetta",
            img: "https://picsum.photos/seed/kamikaze/400/225",
            seccion: "folklore",
            artista_id: idSpinetta,
            eliminado: false
        }
    ]

    const resultadoAlbumes = await db.collection("albumes").insertMany(albumes)
    console.log(`${resultadoAlbumes.insertedCount} albumes cargados`)

    // cierro la conexion asi el script termina y vuelve la terminal
    await cerrarBase()
    console.log("listo")
}

cargarDatos()