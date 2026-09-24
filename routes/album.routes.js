// rutas web de albumes, las que devuelven html
// solo mapean url + verbo a una funcion del controller, no tienen logica

import { Router } from "express"
import * as albumController from "../controllers/album.controller.js"

const router = Router()

router.get("/albumes", albumController.listar)

// alta: el get muestra el formulario, el post lo procesa
router.get("/albumes/nuevo", albumController.formularioNuevo)
router.post("/albumes/nuevo", albumController.crear)

// modificacion
router.get("/albumes/editar/:id", albumController.formularioEditar)
router.post("/albumes/editar/:id", albumController.editar)

// baja
router.get("/albumes/eliminar/:id", albumController.formularioEliminar)
router.post("/albumes/eliminar/:id", albumController.eliminar)

// esta va ultima matchea con cualquier texto
router.get("/albumes/:id", albumController.ver)

export default router