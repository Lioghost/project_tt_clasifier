import Usuario from '../models/Usuario.js'

const edit = async (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    const {id} = req.params

    const user = await Usuario.scope('eliminarPassword').findByPk(req.user.id)
    console.log(user)
    return res.status(200).json(user);
};

const saveChange = async (req, res) => {
    
}

export {
    edit,
    saveChange
}