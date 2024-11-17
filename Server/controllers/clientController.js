import JuntaDesconocida from "../models/JuntaDesconocida.js";
import { emailSendJunta } from '../config/emails.js'

const dashboard = (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    return res.status(200).json({ msg: 'Acceso al dashboard permitido Client' });
};

const sendJuntasDesconocidas = async (req, res, next) => {
    
    try { 
        //Almacenar la imagen y publicar la propiedad
        //const new_junta = await JuntaDesconocida.create({
        //    message: req.body.message,
        //    image: req.file.filename
        //})

        console.log(req.file)
        console.log(req.user)

        emailSendJunta({
            user_email: req.user.email,
            description: req.body.description,
            file: req.file
        })

        return res.status(200).json({msg: 'Solicitud enviada con éxito', msg2: req.body.message}) //Se envia respuesta al usuario

    } catch (error) {
        //Para debuggear
        console.error(error);
        res.status(500).json({msg: 'Error al procesar la solicitud', error: error.message}) //Se envia respuesta al usuario
    }

}

export {
    dashboard,
    sendJuntasDesconocidas
}