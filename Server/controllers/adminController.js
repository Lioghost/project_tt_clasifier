import Usuario from "../models/Usuario.js";
import {Automovil, Marca, Motor} from "../models/indexModels.js";
import { console } from "node:inspector";

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
            return res.status(404).json({ msj: "No se encontraron Marcas" });
        }

        return res.status(200).json({ msj: "Marcas recuperadas con éxito", data: marcas });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las Marcas", error: error.message });
    }
};

//Crear Marca
const marcaCreate = async (req, res) => {
    
    const marca = req.body.marca
    console.log(req.body)
    //Verificar existencia de usuario
    const existeMarca = await Marca.findOne({ where: { marca } })
    
    if(existeMarca)
        return res.status(400).json({msg: 'La Marca ya está registrada'});

    //const usuario = await Usuario.create(req.body)
    await Marca.create({
        marca
    });

    return res.status(200).json({msg: 'Marca creada correctamente'});
}

const marcaGet = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(400).json({ msj: "ID inválido!" });

        const marca = await Marca.findByPk(id);

        if (!marca)
            return res.status(404).json({ msj: "Marca no encontrada" });

        return res.status(200).json({ msj: "Marca recuperada con éxito", data: marca });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar la Marca", error: error.message });
    }
}

const marcaUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca: newMarca } = req.body;

        if (!id) {
            return res.status(400).json({ msj: "ID inválido!" });
        }

        const marca = await Marca.findByPk(id);

        if (!marca) {
            return res.status(404).json({ msj: "Marca no encontrada" });
        }

        if (newMarca) {
            const existingMarca = await Marca.findOne({ where: { marca: newMarca } });
            if (existingMarca) {
                return res.status(400).json({ msj: "El nombre de la marca ya existe" });
            }
        }

        const updatedMarca = await marca.update({ marca: newMarca || marca.marca });
        return res.status(200).json({ msj: "Marca actualizada exitosamente", data: updatedMarca });
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

        return res.status(200).json({ msj: "Autos recuperadas con éxito", data: autos });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las Autos", error: error.message });
    }
};

// Crear un nuevo auto
const autoCreate = async (req, res) => {
    try {
        const { marca_id } = req.body;

        // Verificar si la marca existe
        const marca = await Marca.findByPk(marca_id);
        if (!marca) {
            return res.status(404).json({ msg: "Marca no encontrada" });
        }

        const nuevoAuto = await Automovil.create(req.body);
        return res.status(201).json({ msg: 'Auto creado exitosamente', data: nuevoAuto });
    } catch (error) {
        return res.status(500).json({ msg: 'Error al crear Auto', error: error.message });
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

const autoGet = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido!" });

        const auto = await Automovil.findByPk(id);

        if (!auto)
            return res.status(404).json({ msj: "Auto no encontrado" });

        return res.status(200).json({ msj: "Auto recuperado con éxito", data: auto });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar el Auto", error: error.message });
    }
}

const autoUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido!" });

        const automovil = await Automovil.findByPk(id);

        if (!automovil)
            return res.status(404).json({ msj: "Auto no encontrado" });

        const autoUpdate = await automovil.update(req.body);
        return res.status(200).json({ msj: "Auto actualizado exitosamente", data: autoUpdate });
    } catch (error) {
        return res.status(500).json({ msj: "Error al actualizar", error: error.message });
    }
}

const motores = async (req, res) => {
    try {
        const motores = await Motor.findAll();

        if (motores.length === 0) {
            return res.status(404).json({ msj: "No se encontraron Motores" });
        }

        return res.status(200).json({ msj: "Motores recuperados con éxito", data: motores });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar los Motores", error: error.message });
    }
};

// Crear Motor
const motorCreate = async (req, res) => {
    try {
        const { id_motor } = req.body;

        // Verificar si la marca existe
        const motor = await Motor.findByPk(id_motor);
        if (motor) {
            return res.status(404).json({ msg: "Motor previamente registrado" });
        }

        const nuevoMotor = await Motor.create(req.body);
        return res.status(201).json({ msg: 'Motor creado exitosamente', data: nuevoMotor });
    } catch (error) {
        return res.status(500).json({ msg: 'Error al crear Motor', error: error.message });
    }
};

const motorGet = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido!" });

        const motor = await Motor.findByPk(id); 

        if (!motor)
            return res.status(404).json({ msj: "Motor no encontrado" });

        return res.status(200).json({ msj: "Motor recuperado con éxito", data: motor });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar el Motor", error: error.message });
    }
}

const motorUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido!" });

        const motor = await Motor.findByPk(id);

        if (!motor)
            return res.status(404).json({ msj: "Motor no encontrado" });

        const motorUpdate = await motor.update(req.body);
        return res.status(200).json({ msj: "Motor actualizado exitosamente", data: motorUpdate });
    } catch (error) {
        return res.status(500).json({ msj: "Error al actualizar", error: error.message });
    }
}

const motorDelete = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) 
            return res.status(400).json({ msj: "ID inválido" });

        const auto = await Motor.findByPk(id);

        if (!auto)
            return res.status(404).json({ msj: "Motor no encontrado" });

        await auto.destroy();
        return res.status(200).json({ msj: "Motor eliminado con éxito" });

    } catch (error) {
        return res.status(500).json({ msj: "Error al eliminar el Motor", error: error.message });
    }   
}

export {
    dashboard,
    users,
    enableAdminUser,
    marcas,
    marcaCreate,
    marcaGet,
    marcaUpdate,
    marcaDelete,
    automoviles,
    autoCreate,
    autoDelete,
    autoGet,
    autoUpdate,
    motores,
    motorCreate,
    motorGet,
    motorUpdate,
    motorDelete
}