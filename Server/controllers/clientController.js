import JuntaDesconocida from "../models/JuntaDesconocida.js";

const dashboard = (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    return res.status(200).json({ msg: 'Acceso al dashboard permitido Client' });
};

const sendJuntasDesconocidas = async (req, res, next) => {
    
    try { 
        //Almacenar la imagen y publicar la propiedad
        const new_junta = await JuntaDesconocida.create({
            message: req.body.message,
            image: req.file.filename
        })

        return res.status(200).json({msg: 'Imagen subida correctamente', msg2: req.body.message}) //Se envia respuesta al usuario

    } catch (error) {
        //Para debuggear
        console.error(error);
    }

}

export {
    dashboard,
    sendJuntasDesconocidas
}