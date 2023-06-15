import Tarea from '../models/Tarea.js'
import Proyecto from '../models/Proyectos.js';

const agregarTarea = async (req, res) => {
    const { proyecto } = req.body;
    try {
        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            const error = new Error({ msg: 'El proyecto que estas buscando no existe' })
            return res.status(404).json({ msg: error.message })
        };

        if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error({ msg: 'No tienes permisos' })
            return res.status(403).json({ msg: error.message })
        };

        const tareaAlmacenada = await Tarea.create(req.body)

        //Almacenar el ID en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save();

        res.json(tareaAlmacenada)

    } catch (error) {
        res.status(404).json({ msg: 'El id que ingresaste no es valido' });
    }
}

const obtenerTarea = async (req, res) => {
    const { id } = req.params
    try {
        //con polpulate ahora voy a tener todo el modelo del proyecto en vez de solo el id en la 
        //variable "proyecto" del modelo de tarea
        const tarea = await Tarea.findById(id).populate("proyecto");
        if (!tarea) {
            const error = new Error({ msg: 'Tarea no encontrada' })
            return res.status(404).json({ msg: error.message })
        };
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error({ msg: 'No tienes permisos' })
            return res.status(403).json({ msg: error.message })
        };
        res.json(tarea)
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'El id que ingresaste no es valido' });
    }
}

const actualizarTarea = async (req, res) => {
    const { id } = req.params
    try {
        //con polpulate ahora voy a tener todo el modelo del proyecto en vez de solo el id en la 
        //variable "proyecto" del modelo de tarea
        const tarea = await Tarea.findById(id).populate("proyecto");
        if (!tarea) {
            const error = new Error({ msg: 'Tarea no encontrada' })
            return res.status(404).json({ msg: error.message })
        };
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error({ msg: 'No tienes permisos' })
            return res.status(403).json({ msg: error.message })
        };

        tarea.nombre = req.body.nombre || tarea.nombre;
        tarea.descripcion = req.body.descripcion || tarea.nombre;
        tarea.prioridad = req.body.prioridad || tarea.nombre;
        tarea.fecchaEntrega = req.body.fecchaEntrega || tarea.nombre;

        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'El id que ingresaste no es valido' });
    }

}

const eliminarTarea = async (req, res) => {
    const { id } = req.params
    try {
        //con polpulate ahora voy a tener todo el modelo del proyecto en vez de solo el id en la 
        //variable "proyecto" del modelo de tarea
        const tarea = await Tarea.findById(id).populate("proyecto");
        if (!tarea) {
            const error = new Error({ msg: 'Tarea no encontrada' })
            return res.status(404).json({ msg: error.message })
        };
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error({ msg: 'No tienes permisos' })
            return res.status(403).json({ msg: error.message })
        };

        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

        res.json({ msg: 'La tarea se elimino' })

    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'El id que ingresaste no es valido' });
    }

}

const cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params
    try {
        //con polpulate ahora voy a tener todo el modelo del proyecto en vez de solo el id en la 
        //variable "proyecto" del modelo de tarea
        const tarea = await Tarea.findById(id).populate("proyecto")

        if (!tarea) {
            const error = new Error({ msg: 'Tarea no encontrada' })
            return res.status(404).json({ msg: error.message })
        }

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
            !tarea.proyecto.colaboradores.some(
                (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
            )) {
            const error = new Error({ msg: 'No tienes permisos' })
            return res.status(403).json({ msg: error.message })
        };

        tarea.estado = !tarea.estado;
        tarea.completado = req.usuario._id;
        await tarea.save()

        const tareaAlmacenada = await Tarea.findById(id)
        .populate('proyecto')
        .populate('completado')

        res.json(tareaAlmacenada)

    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: 'El id que ingresaste no es valido' });
    }

}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstadoTarea
}