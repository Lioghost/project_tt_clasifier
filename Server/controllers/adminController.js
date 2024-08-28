import Usuario from "../models/Usuario.js";

const dashboard = (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    return res.status(200).json({ msg: 'Acceso al dashboard permitido Admin' });
};

const users = async (req, res) => {
    
    const users = await Usuario.scope('eliminarPassword').findAll()
    //console.log(user)
    return res.status(200).json(users);
};


const enable_admin_user = async (req, res) => {

    //Validar que el usuario exista
    try {
        const user = await Usuario.scope('eliminarPassword').findByPk(req.params.id)

        if(!user)
            return res.status(400).json({msj: "Usuario no encontrado"});

        await user.update(req.body)
        res.status(200).json({msj: "Actualización Exitosa", user: user});
    } catch (error) {
        res.status(400).json({msj: "Error al actualizar", error: error});
    }

}

export {
    dashboard,
    users,
    enable_admin_user
}