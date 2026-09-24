import express from "express"
import { conectarBase } from "./config/db.js"
import albumRoutes from "./routes/album.routes.js"
import * as albumView from "./views/album.view.js"
import albumApiRoutes from "./api/routes/album.routes.js"
import { paginaError } from "./views/layout.view.js"
import artistaRoutes from "./routes/artista.routes.js"
import artistaApiRoutes from "./api/routes/artista.routes.js"

const app = express()
const PORT = process.env.PORT || 3333

// sirvo los archivos estaticos de la carpeta public (css, imagenes)
app.use(express.static("public"))

// traduzco los datos que llegan de un formulario html a un objeto en req.body
app.use(express.urlencoded({ extended: true }))

// traduzco los datos que llegan en formato json, lo va a usar la api
app.use(express.json())

// pagina de inicio con el menu de secciones
app.get("/", (req, res) => res.send(albumView.inicio()))

// rutas web
app.use(albumRoutes)
app.use(artistaRoutes)

// rutas de la api
app.use(albumApiRoutes)
app.use(artistaApiRoutes)

// 404 para la api, en json
app.use("/api", (req, res) => {
    res.status(404).json({ error: "Endpoint no encontrado" })
})

// 404 para el resto del sitio, en html
app.use((req, res) => {
    res.status(404).send(paginaError("404", "La página que buscás no existe."))
})

// primero me conecto a la base y recien ahi prendo el servidor
// si la base falla no tiene sentido levantar la web
try {
    //await conectarBase()

    app.listen(PORT, () => {
        console.log(`doovy funcionando en http://localhost:${PORT}`)
    })
} catch (error) {
    console.error("no se pudo conectar a la base de datos")
    console.error(error.message)
    process.exit(1)
}