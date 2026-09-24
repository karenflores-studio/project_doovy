// rutas de la api de artistas

import { Router } from "express"
import * as artistaApiController from "../controllers/artista.controller.js"

const router = Router()

router.get("/api/artistas", artistaApiController.listar)
router.post("/api/artistas", artistaApiController.crear)
router.get("/api/artistas/:id", artistaApiController.ver)

// ruta anidada: los albumes que pertenecen a este artista
router.get("/api/artistas/:id/albumes", artistaApiController.albumesDelArtista)

export default router