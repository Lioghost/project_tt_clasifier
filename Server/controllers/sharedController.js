import Usuario from '../models/Usuario.js'

const edit = async (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    const {id} = req.params

    const user = await Usuario.scope('eliminarPassword').findByPk(id)
    //console.log(user)
    return res.status(200).json(user);
};

const saveChange = async (req, res) => {
    const {id} = req.params
    
    //Validar que el usuario exista
    const user = await Usuario.scope('eliminarPassword').findByPk(id)
    
    if(!user) {
        return res.redirect('/auth/login') //Si no existe el id en el url se redirecciona a "mis-propiedades"
    }

    try {
        const {name, lastname, username, password} = req.body

        user.set({
            name,
            lastname,
            username
        })

        if(password !== undefined)
            user.set({password})

        await user.save()
        return res.status(200).json({msj: "Actualización Exityosa", user: user});    
    } catch (e) {
        return res.status(400).json({msj: "Error al actualizar", error: e});
    }
}

const identificador = async(req, res, next) => {

    try {
        console.log(req.file);  //req.file lo registra multer y ya se tiene acceso en el req, y res
         
        //Almacenar la imagen y publicar la propiedad
        const test_image = req.file.filename
        console.log(test_image)
        //await propiedad.save()

        //res.redirect('/mis-propiedades') No se ejecuta porque se esta ejecutando codigo javascript en propiedad
            //init de dropzone, por lo que se podria decir estamos trabajando aparte
            //se tiene que enviar al usuario al siguiente middleware o regresarlo al codigo a través de next()
        next()

    } catch (error) {
        //Para debuggear
        console.error(error);
    }

}

export {
    edit,
    saveChange,
    identificador
}