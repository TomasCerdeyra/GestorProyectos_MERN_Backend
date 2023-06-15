import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  //Agarro solo los proyectos del usuario
  const proyectos = await Proyecto.find({
    '$or': [
      { 'colaboradores': { $in: req.usuario } },
      { 'creador': { $in: req.usuario } }
    ]
  }).select('-tareas');

  res.json(proyectos)
}

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.log(error);
  }

  console.log(req.usuario);
  console.log('loll');
}

//Trae un solo proyecto
const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id)
    .populate({path: 'tareas', populate: {path: 'completado', select: "nombre"}})
    .populate('colaboradores', 'nombre email');

    if (!proyecto) {
      const error = new Error({ msg: 'El proyecto que estas buscando no existe' })
      return res.status(404).json({ msg: error.message })
    };

    if (
      proyecto.creador.toString() !== req.usuario._id.toString() &&
      !proyecto.colaboradores.some(
        (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
      )
    ) {
      const error = new Error({ msg: 'No tienes permisos' })
      return res.status(404).json({ msg: error.message })
    };

    res.json(proyecto);
  } catch (error) {
    res.status(404).json({ msg: 'El id que ingresaste no es valido' });
  };
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      const error = new Error({ msg: 'El proyecto que estas buscando no existe' })
      return res.status(404).json({ msg: error.message })
    };

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error({ msg: 'No tienes permisos' })
      return res.status(404).json({ msg: error.message })
    };

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    const proyectoAlmacenado = await proyecto.save();

    res.json(proyectoAlmacenado);
  } catch (error) {
    res.status(404).json({ msg: 'El id que ingresaste no es valido' });
  };
};


const eliminarProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      const error = new Error({ msg: 'El proyecto que estas buscando no existe' })
      return res.status(404).json({ msg: error.message })
    };

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error({ msg: 'No tienes permisos' })
      return res.status(404).json({ msg: error.message })
    };

    await proyecto.deleteOne();

    res.json({ msg: 'Proyecto eliminado' });
  } catch (error) {
    res.status(404).json({ msg: 'El id que ingresaste no es valido' });
  };
}

const buscarColaborardor = async (req, res) => {
  const { email } = req.body
  const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message })
  }

  res.json(usuario)
}

const agregarColaborardor = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error('Proyecto no Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(404).json({ msg: error.message })
  }

  const { email } = req.body
  const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v')

  if (!usuario) {
    const error = new Error('Usuario no encontrado');
    return res.status(404).json({ msg: error.message })
  }

  // El colaborador no es el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error('No puedes agregar al creador del proyecto')
    return res.status(404).json({ msg: error.message })
  }

  // Revisar que el colaborador a agregar no este ya en el proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error('El usuaio ya pertenece al proyecto')
    return res.status(404).json({ msg: error.message })
  }

  //Agregar usuario
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({ msg: 'colaborador agregado correctamente' })
}

const eliminarColaborardor = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error('Proyecto no Encontrado')
    return res.status(404).json({ msg: error.message })
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(404).json({ msg: error.message })
  }

  //Eliminar usuario
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({ msg: 'Colaborador eliminado correctamente' })
}

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborardor,
  agregarColaborardor,
  eliminarColaborardor,
}

