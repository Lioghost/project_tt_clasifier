import Usuario from "../models/Usuario.js";
//import Marca from "../models/Marca.js";
//import Automovil from "../models/Automovil.js";
import {Automovil, Marca} from "../models/indexModels.js";

const dashboard = (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    return res.status(200).json({ msg: 'Acceso al dashboard permitido Admin' });
};

const users = async (req, res) => {
    
    const users = await Usuario.scope('eliminarPassword').findAll()
    //console.log(user)
    return res.status(200).json(users);
};

const enableAdminUser = async (req, res) => {
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

const marcas = async (req, res) => {
    try {
        const marcas = await Marca.findAll();

        if (marcas.length === 0) {
            return res.status(404).json({ msj: "No se encontraron marcas" });
        }

        return res.status(200).json({ msj: "Marcas recuperadas con éxito", data: marcas });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las marcas", error: error.message });
    }
};

//Crear Marca
const marcaCreate = async (req, res) => {
    
    const marca = req.body.marca
    console.log(req.body)
    //Verificar existencia de usuario
    const existeMarca = await Marca.findOne({ where: { marca } })
    
    if(existeMarca)
        return res.status(400).json({msg: 'La marca ya está registrada'});

    //const usuario = await Usuario.create(req.body)
    await Marca.create({
        marca
    });

    return res.status(200).json({msg: 'Marca creada correctamente'});
}

const marcaUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido!" });

        const marca = await Marca.findByPk(id);

        if (!marca)
            return res.status(404).json({ msj: "Marca no encontrada" });

        marca = await marca.update({marca: req.body.marca || marca.marca});
        return res.status(200).json({ msj: "Marca actualizada exitosamente", data: marca });
    } catch (error) {
        return res.status(500).json({ msj: "Error al actualizar", error: error.message });
    }
};

const marcaDelete = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido" });

        const marca = await Marca.findByPk(id);

        if (!marca)
            return res.status(404).json({ msj: "Marca no encontrada" });

        await marca.destroy();
        return res.status(200).json({ msj: "Marca eliminada con éxito" });

    } catch (error) {
        return res.status(500).json({ msj: "Error al eliminar la marca", error: error.message });
    }
};

const automoviles = async (req, res) => {
    try {
        const autos = await Automovil.findAll({
            include: [
                { model: Marca, as: 'marca' }
            ]
        });

        if (autos.length === 0) {
            return res.status(404).json({ msj: "No se encontraron autos" });
        }

        return res.status(200).json({ msj: "Marcas recuperadas con éxito", data: autos });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las marcas", error: error.message });
    }
};

// Crear un nuevo auto
const autoCreate = async (req, res) => {
    try {
        const { marcaId, submarca, modelo, litros } = req.body;

        // Verificar si la marca existe
        const marca = await Marca.findByPk(marcaId);
        if (!marca) {
            return res.status(404).json({ msg: "Marca no encontrada" });
        }

        const nuevoAuto = await Automovil.create({ marcaId, submarca, modelo, litros });
        return res.status(201).json({ msg: 'Auto creado exitosamente', data: nuevoAuto });
    } catch (error) {
        return res.status(500).json({ msg: 'Error al crear auto', error: error.message });
    }
};

const autoDelete = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido" });

        const auto = await Automovil.findByPk(id);

        if (!auto)
            return res.status(404).json({ msj: "Auto no encontrado" });

        await auto.destroy();
        return res.status(200).json({ msj: "Auto eliminado con éxito" });

    } catch (error) {
        return res.status(500).json({ msj: "Error al eliminar el auto", error: error.message });
    }   
}

const autoUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido!" });

        const automovil = await Automovil.findByPk(id);

        if (!automovil)
            return res.status(404).json({ msj: "Automovil no encontrada" });

        const autoUpdate = await automovil.update(req.body);
        return res.status(200).json({ msj: "Marca actualizada exitosamente", data: autoUpdate });
    } catch (error) {
        return res.status(500).json({ msj: "Error al actualizar", error: error.message });
    }
}

export {
    dashboard,
    users,
    enableAdminUser,
    marcas,
    marcaCreate,
    marcaUpdate,
    marcaDelete,
    automoviles,
    autoCreate,
    autoDelete,
    autoUpdate
}