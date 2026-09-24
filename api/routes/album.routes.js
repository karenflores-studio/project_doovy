// rutas de la api de albumes, las que devuelven json
// aca si podemos usar rest de verdad: la url es el recurso y el verbo es la accion

import { Router } from "express"
import * as albumApiController from "../controllers/album.controller.js"

const router = Router()

// sobre la coleccion completa
router.get("/api/albumes", albumApiController.listar)
router.post("/api/albumes", albumApiController.crear)

// sobre un album en particular
router.get("/api/albumes/:id", albumApiController.ver)
router.put("/api/albumes/:id", albumApiController.reemplazar)
router.patch("/api/albumes/:id", albumApiController.actualizar)
router.delete("/api/albumes/:id", albumApiController.eliminar)

export default router

