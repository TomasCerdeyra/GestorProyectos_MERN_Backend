import nodemailer from 'nodemailer'


const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //info email

    const info = await transport.sendMail({
        from: '"UPTask - Administrados de proyectos" <cuentas@uptask@gmail.com>',
        to: email,
        subject: "Upstask - Confirma tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Upstasck</p>
        <p>Tu cuenta esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar tu cuenta </a>
        
        <p>Si no creaste esta cuenta, puedes ignorar este mensaeje</p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //info email

    const info = await transport.sendMail({
        from: '"UPTask - Administrados de proyectos" <cuentas@uptask@gmail.com>',
        to: email,
        subject: "Upstask - Restablece tu Password",
        text: "Restablece tu Password",
        html: `<p>Hola: ${nombre} has solicitado Restablecer tu Password</p>
        
        <p>Sigue el siguiente enlace para generar un nuevo password:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Comprobar tu cuenta </a>
        
        <p>Si no enviaste, puedes ignorar este mensaeje</p>
        `
    })
}


export {
    emailRegistro,
    emailOlvidePassword
}