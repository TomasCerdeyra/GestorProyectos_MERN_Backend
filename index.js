import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import './config/db.js'
//Routes
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoute from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoute.js'
//contra user DB hola123

const app = express();
app.use(express.json())

//Configurar CORS
/* const whitelist = [process.env.FRONTEND_URL]

const corsOtions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            //Tiene los permisos para consultar la API
            callback(null, true)
        } else {
            //No tiene los permisos para consultar la API
            callback(new Error('Error de Cors'))
        }
    }
} */

app.use(cors());

//Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoute)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.PORT || 8080
const servidor = app.listen(PORT, () => {
    console.log("http://localhost:" + PORT);
})


// Socket.io
import { Server, Socket } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {
    //Definir enventos
    socket.on('abrir proyecto', proyecto => {
        socket.join(proyecto)
    })

    //Me quede en el error que no me muestra la tarea en el front
    socket.on('nueva tarea', tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('actualizar tarea', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('completar tarea', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea completada', tarea)
    })
})