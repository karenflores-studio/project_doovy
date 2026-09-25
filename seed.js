// script para cargar los datos en la base
// se corre a mano con: npm run seed
// borra todo lo que haya y carga de nuevo

import { db, conectarBase, cerrarBase } from "./config/db.js"

// los artistas van primero porque los albumes necesitan su _id para la relacion
const artistas = [
    {
        nombre: "Luis Alberto Spinetta",
        foto: "https://i.scdn.co/image/ab6761610000e5ebe1988a1a730ae50728967a16",
        descripcion: "Músico y compositor argentino, referente ineludible del rock nacional.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Soda Stereo",
        foto: "https://www.cmtv.com.ar/imagenes_artistas/276.webp",
        descripcion: "Trío argentino que marcó el rock latinoamericano de los años 80 y 90.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Gustavo Cerati",
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1ICPvKhFaIxShK9aauqX4PIXo65uW0fzXddZZWeYGLxbVG_NC7PUDq58&s=10",
        descripcion: "Cantante y productor argentino, explorador del cruce entre rock y electrónica.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Mercedes Sosa",
        foto: "https://i.scdn.co/image/ab6761610000e5eb5eb33e71c4c337f35c1df5b4",
        descripcion: "La voz de América Latina, referente del folklore y la canción comprometida.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Bill Evans",
        foto: "https://i.discogs.com/P39Eg-JIXycysc6A92Cs-jPpYBzGb3HRhv1VqPlB1KU/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTI1MjMx/MC0xNzI5MTMzNDkz/LTgyNTUuanBlZw.jpeg",
        descripcion: "Pianista estadounidense que redefinió el sonido del trío de jazz moderno.",
        pais: "Estados Unidos",
        eliminado: false
    },
    {
        nombre: "Miranda!",
        foto: "https://robertoramasso.com/wp-content/uploads/Miranda-Ramasso-Productora-1-819x1024.webp",
        descripcion: "Dúo argentino de pop electrónico surgido a comienzos de los 2000.",
        pais: "Argentina",
        eliminado: false
    },
    {
        // este artista queda sin albumes a proposito
        // la consigna pide que un cliente pueda existir sin proyectos asociados
        nombre: "Wos",
        foto: "https://media.trece.com.py/sites/2/2024/04/wos-.jpg",
        descripcion: "Rapero y cantautor argentino de la nueva escena.",
        pais: "Argentina",
        eliminado: false
    },
    {
        nombre: "Green Day",
        foto: "https://i.scdn.co/image/ab6761610000e5eb6ff0cd5ef2ecf733804984bb",
        descripcion: "Banda estadounidense de punk rock y rock alternativo formada en 1987 en California por el vocalista y guitarrista Billie Joe Armstrong y el bajista Mike Dirnt, a quienes más tarde se unió el baterista Tré Cool. El grupo alcanzó el éxito masivo internacional en 1994 con su aclamado álbum Dookie, convirtiéndose en una de las bandas clave para revivir el interés popular por el punk rock en los años 90.",
        pais: "Estados Unidos",
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
    const idSoda = ids[1]
    const idCerati = ids[2]
    const idSosa = ids[3]
    const idEvans = ids[4]
    const idMiranda = ids[5]
    const idWos = ids[6]
    const idGreenDay = ids[7]

    // los albumes se arman aca adentro porque recien ahora tengo los ids de los artistas
    const albumes = [
        // ---------- rock ----------
        {
            titulo: "Artaud",
            descripcion: "Disco bisagra del rock argentino, editado bajo el nombre Pescado Rabioso.",
            canciones: ["Todas las hojas son del viento", "Cantata de puentes amarillos", "Bajan"],
            anio: 1973,
            link: "https://open.spotify.com/search/Artaud%20Spinetta",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwtAK92nt8iNnMm7F7TydmjFq_gA4NNZ14C3LpfaT8ZA&s=10",
            seccion: "rock",
            artista_id: idSpinetta,
            eliminado: false
        },
        {
            titulo: "Signos",
            descripcion: "Tercer álbum de Soda Stereo, el que los consolidó en toda Latinoamérica.",
            canciones: ["Prófugos", "Persiana americana", "En camino"],
            anio: 1986,
            link: "https://open.spotify.com/search/Signos%20Soda%20Stereo",
            img: "https://akamai.sscdn.co/uploadfile/letras/albuns/5/1/b/4/195361745856012.jpg",
            seccion: "rock",
            artista_id: idSoda,
            eliminado: false
        },
        {
            titulo: "Canción Animal",
            descripcion: "El disco más rockero de Soda Stereo y uno de los más vendidos de la banda.",
            canciones: ["De música ligera", "Un millón de años luz", "Té para tres"],
            anio: 1990,
            link: "https://open.spotify.com/search/Cancion%20Animal",
            img: "https://mariskalrock.com/wp-content/uploads/2020/08/SODA-STEREO-INT.jpg",
            seccion: "rock",
            artista_id: idSoda,
            eliminado: false
        },
        {
            titulo: "American Idiot",
            descripcion: "Relata la historia de un antihéroe adolescente llamado 'Jesus of Suburbia' en medio de una fuerte crítica social y política hacia la sociedad estadounidense post-11 de septiembre",
            canciones: ["American Idiot", "Jesus of Suburbia", "Holiday", "Are We the Waiting", "St. Jimmy", "Give Me Novacaine", "She's a Rebel", "Extraordinary Girl", "Letterbomb", "Boulevard of Broken Dreams", "Wake Me Up When September Ends", "Homecoming", "Whatsername"],
            anio: 2004,
            link: "https://open.spotify.com/album/5dN7F9DV0Qg1XRdIgW8rke",
            img: "https://i.scdn.co/image/ab67616d0000b27308a1b1e0674086d3f1995e1b",
            seccion: "rock",
            artista_id: idGreenDay,
            eliminado: false
        },

        // ---------- pop ----------
        {
            titulo: "Sin Restricciones",
            descripcion: "Debut de Miranda! que definió el sonido del pop electrónico argentino.",
            canciones: ["Don", "Yo te diré", "Bailarina"],
            anio: 2002,
            link: "https://open.spotify.com/search/Sin%20Restricciones%20Miranda",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwhVaW4KsVq0_FHlZ5KncGqqULZ35m-goAQEo71Ab4PGsdCXQ058edxO0&s=10",
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
            img: "https://www.cmtv.com.ar/tapas-cd/mirandaesmentira.webp",
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
            img: "https://i.scdn.co/image/ab67616d0000b273d0d2be31496cb2996903e1c4",
            seccion: "pop",
            artista_id: idMiranda,
            eliminado: false
        },

        // ---------- jazz ----------
        {
            titulo: "Portrait in Jazz",
            descripcion: "Primer disco del trío legendario de Bill Evans.",
            canciones: ["Autumn Leaves", "Blue in Green", "Peri's Scope"],
            anio: 1960,
            link: "https://open.spotify.com/search/Portrait%20in%20Jazz",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzCcDKwoBGAjX-yM5dJKWTbrqS946vCYQIw3wds0fpPcp1LWLpEWfAws4U&s=10",
            seccion: "jazz",
            artista_id: idEvans,
            eliminado: false
        },
        {
            titulo: "Waltz for Debby",
            descripcion: "Grabado en vivo en el Village Vanguard, un clásico absoluto del piano jazz.",
            canciones: ["My Foolish Heart", "Waltz for Debby (incluyendo tomas adicionales o principales)", "Detour Ahead", "My Romance", "Some Other Time", "Milestones", "Porgy (I Loves You, Porgy)"],
            anio: 1961,
            link: "https://open.spotify.com/search/Waltz%20for%20Debby",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI8hKkyuT4Cbed-_yuv9hMvjNhUL24Pfn_qZSQ24dixVA5twRMSyy8wLQ&s=10",
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
            img: "https://i.scdn.co/image/ab67616d0000b27380baf2f0d9d7d6ec18bf75f7",
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
            img: "https://i.scdn.co/image/ab67616d0000b2731152471596980e1bba03b6ab",
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
            img: "https://i.scdn.co/image/ab67616d0000b27392441ecd34874c2bc4f19144",
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
            img: "https://i.scdn.co/image/ab67616d0000b27314653b83cd7d851accdb5142",
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
            img: "https://i.scdn.co/image/ab67616d00001e0258b372b5c69c59aec0c99989",
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
            img: "https://i.scdn.co/image/ab67616d0000b273a1433832dffafcb82ad46936",
            seccion: "folklore",
            artista_id: idSpinetta,
            eliminado: false
        },
        {
            titulo: "Cantora 1",
            descripcion: "Disco de duetos grabado en los últimos años de su carrera.",
            canciones: ["Zona de promesas", "Razón de vivir", "La maza"],
            anio: 2009,
            link: "https://open.spotify.com/search/Cantora%201",
            img: "https://www.cmtv.com.ar/tapas-cd/mercedessosacantora1.webp",
            seccion: "folklore",
            artista_id: idSosa,
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
