import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    fechaEntrega: {
        type: Date,
        required: true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        required: true,
        //Con enum solo permito q los valores q pueda tomar son los q declare en el arreglo
        enum: ['Baja', 'Media', 'Alta']
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    },
    completado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
},{
    timestamp: true
})

const Tarea = mongoose.model('Tarea', tareaSchema);

export default Tarea