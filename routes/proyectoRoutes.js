import { Router } from 'express'
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborardor,
    agregarColaborardor,
    eliminarColaborardor,
} from '../controllers/proyectoController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = Router();

router.route('/')
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto)

router.route('/:id')
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto)


router.post('/colaboradores', checkAuth, buscarColaborardor)

router.post('/colaboradores/:id', checkAuth, agregarColaborardor)

//Para eliminar hago un post ya q DELETE se usa para 
//eliminar un elemento completo y aca solo elimino el colaborador
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborardor)

export default router