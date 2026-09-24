import express from "express"
import { conectarBase } from "./config/db.js"
import albumRoutes from "./routes/album.routes.js"
import * as albumView from "./views/album.view.js"

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

// enchufo las rutas web de albumes
app.use(albumRoutes)

// si ninguna ruta anterior matcheo, entonces la pagina no existe
app.use((req, res) => {
    res.status(404).send(albumView.paginaError("404", "La página que buscás no existe."))
})

// primero me conecto a la base y recien ahi prendo el servidor
// si la base falla no tiene sentido levantar la web
try {
    await conectarBase()

    app.listen(PORT, () => {
        console.log(`doovy funcionando en http://localhost:${PORT}`)
    })
} catch (error) {
    console.error("no se pudo conectar a la base de datos")
    console.error(error.message)
    process.exit(1)
}