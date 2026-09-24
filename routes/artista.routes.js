// rutas web de artistas, las que devuelven html

import { Router } from "express"
import * as artistaController from "../controllers/artista.controller.js"

const router = Router()

router.get("/artistas", artistaController.listar)

// alta: el get muestra el formulario, el post lo procesa
router.get("/artistas/nuevo", artistaController.formularioNuevo)
router.post("/artistas/nuevo", artistaController.crear)

// esta va ultima: /artistas/:id matchea con cualquier texto
router.get("/artistas/:id", artistaController.ver)

export default router