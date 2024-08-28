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

export {
    edit,
    saveChange
}