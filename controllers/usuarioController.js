import Usuario from "../models/Usuario.js"
import generearId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js"


const registrar = async (req, res) => {
    //Evitar registros duplicados
    const { email } = req.body
    const existeUser = await Usuario.findOne({ email })
    if (existeUser) {
        const error = new Error("Usuaio ya registrado")
        return res.status(400).json({ msg: error.message })
    }

    try {
        const usuario = await new Usuario(req.body)
        usuario.token = generearId();
        await usuario.save();

        //Enviar mail
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({ msg: 'Usuario creado correctamente, Revisa tu Email para confirmar tu cuenta' })
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body
    const usuario = await Usuario.findOne({ email })
    //Comprobar si usuario existe
    if (!usuario) {
        const error = new Error('El Usuario no existe')
        return res.status(404).json({ msg: error.message })
    }
    //Comprobar si usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({ msg: error.message })
    }
    //Comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    } else {
        const error = new Error('Tu Password es incorrecto')
        return res.status(403).json({ msg: error.message })
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error('Token no valido')
        return res.status(403).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save()

        res.json({ msg: 'Usuario Confirmado Correctamente' })
        console.log(usuarioConfirmar);
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email })
    //Comprobar si usuario existe
    if (!usuario) {
        const error = new Error('El Usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuario.token = generearId();
        await usuario.save();

        //Enviar el email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error);
    }

}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    const tokenValido = await Usuario.findOne({ token })
    if (tokenValido) {
        res.json({ msg: 'Token valido y el usuario Existe' })
    } else {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({ token })
    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({ msg: 'Password modificado correctamente' })
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })
    }
}

const perfil = async (req, res) => {
    const { usuario } = req

    res.json(usuario);
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}