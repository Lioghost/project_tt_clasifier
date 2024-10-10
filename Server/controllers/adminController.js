import Usuario from "../models/Usuario.js";
import {Automovil, Marca, Motor, Junta} from "../models/indexModels.js";
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
            
            if (existingMarca && marca.id !== existingMarca.id) {
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
                { model: Marca, as: 'marca' },
                { model: Motor, as: 'motores' }
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
        const { marca_id, id_auto, motor_ids } = req.body;

        // Verificar si la marca existe
        const marca = await Marca.findByPk(marca_id);
        if (!marca) {
            return res.status(404).json({ msg: "Marca no encontrada" });
        }

        // Verificar si el id_auto ya existe
        const autoExist = await Automovil.findOne({ where: { id_auto } });
        if (autoExist) {
            return res.status(400).json({ msg: "El id_auto ya existe" });
        }

        const nuevoAuto = await Automovil.create(req.body);

         // Si se proporcionaron motores, asociarlos
        if (motor_ids && motor_ids.length > 0) {
            const motores = await Motor.findAll({ where: { id: motor_ids } });
            await nuevoAuto.addMotores(motores);  // Asociar motores al automóvil
        }
        return res.status(201).json({ msg: 'Auto creado exitosamente', data: nuevoAuto });
    } catch (error) {
        return res.status(500).json({ msg: 'Error al crear Auto', error: error.message });
    }
};

const autoDelete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Automovil.destroy({
            where: { id }
        });

        if (!deleted)
            return res.status(404).json({ msg: 'Automóvil no encontrado' });

        return res.status(200).json({ msg: 'Automóvil eliminado exitosamente' });

    } catch (error) {
        return res.status(500).json({ msj: "Error al eliminar el auto", error: error.message });
    }   
}

const autoGet = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar si el ID es un número válido
        if (!id || isNaN(id)) 
            return res.status(400).json({ msj: "ID inválido, debe ser un número!" });

        // Buscar el automóvil por su ID, incluyendo las relaciones
        const auto = await Automovil.findByPk(id, {
            include: [
                { model: Marca, as: 'marca' },  // Incluir la relación con Marca
                { model: Motor, as: 'motores' } // Incluir la relación con Motor
            ]
        });

        // Verificar si el auto existe
        if (!auto) 
            return res.status(404).json({ msj: "Auto no encontrado" });

        // Devolver el auto con éxito
        return res.status(200).json({ 
            msj: "Auto recuperado con éxito", 
            data: auto 
        });

    } catch (error) {
        // Diferenciar entre errores específicos de Sequelize y otros errores
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({ msj: "Error en la base de datos", error: error.message });
        }

        return res.status(500).json({ msj: "Error inesperado al recuperar el Auto", error: error.message });
    }
};


const autoUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const {motor_ids, id_auto} = req.body

        // Verificar si el id_auto ya existe
        const autoExist = await Automovil.findOne({ where: { id_auto } });
        if (autoExist && autoExist.id != id) {
            return res.status(400).json({ msg: "El id_auto ya existe" });
        }

        // Actualizar el automóvil
        const [updated] = await Automovil.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ msg: 'Automóvil no encontrado' });
        }

        // Actualizar las asociaciones de motores si `motor_ids` está presente
        if (motor_ids && motor_ids.length > 0) {
            const automovil = await Automovil.findByPk(id);
            const motores = await Motor.findAll({ where: { id_motor: motor_ids } });
            await automovil.setMotores(motores);  // Reemplazar asociaciones anteriores
            await automovil.save()
        }

        const autoUpdate = await Automovil.findByPk(id, {
            include: { model: Motor }
        });
        return res.status(200).json({ msj: "Auto actualizado exitosamente", data: autoUpdate });
    } catch (error) {
        return res.status(500).json({ msj: "Error al actualizar", error: error.message });
    }
}

const motores = async (req, res) => {
    try {
        const motores = await Motor.findAll({
            include: { model: Junta, as: 'juntas' }
        });

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
        const { id_motor, auto_ids, junta_ids } = req.body;

        // Verificar si la marca existe
        const motor = await Motor.findByPk(id_motor);
        if (motor) {
            return res.status(404).json({ msg: "Motor previamente registrado" });
        }

        const nuevoMotor = await Motor.create(req.body);

        // Asociar automóviles al motor si `auto_ids` está presente
        if (auto_ids && auto_ids.length > 0) {
            const autos = await Automovil.findAll({ where: { id: auto_ids } });
            await nuevoMotor.addAutomoviles(autos);  // Asociar automóviles al motor
        }

        // Asociar juntas al motor si `junta_ids` está presente
        if (junta_ids && junta_ids.length > 0) {
            const juntas = await Junta.findAll({ where: { id_junta: junta_ids } });
            await nuevoMotor.addJuntas(juntas)  // Asociar automóviles al motor
        }
        
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

        const motor = await Motor.findByPk(id, {
            include: [
                {model: Junta, as: 'juntas'},
                //{model: Automovil, as: 'automoviles'}
            ]
        }); 

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
        const {auto_ids, id_motor, junta_ids} = req.body

        // Verificar si el id_auto ya existe
        const motorExist = await Motor.findOne({ where: { id_motor } });
        if (motorExist && motorExist.id != id) {
            return res.status(400).json({ msg: "El id_motor ya existe" });
        }

        const [updated] = await Motor.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ msg: 'Motor no encontrado' });
        }

        // Actualizar las asociaciones de automóviles si `auto_ids` está presente
        if (auto_ids && auto_ids.length >= 0) {
            const motor = await Motor.findByPk(id);
            const autos = await Automovil.findAll({ where: { id_auto: auto_ids } });
            await motor.setAutomoviles(autos);  // Reemplazar asociaciones anteriores
            await motor.save()
        }

        // Actualizar las asociaciones de motores si `motor_ids` está presente
        if (junta_ids && junta_ids.length > 0) {
            const motor = await Motor.findByPk(id);
            const juntas = await Junta.findAll({ where: { id_junta: junta_ids } });
            await motor.setJuntas(juntas);  // Reemplazar asociaciones anteriores
            await motor.save()
        }

        //const motorUpdate = await Motor.findByPk(id, {
        //    include: { model: Automovil }
        //});

        return res.status(200).json({ msj: "Motor actualizado exitosamente", data: motorUpdate });
    } catch (error) {
        return res.status(500).json({ msj: "Error al actualizar", error: error.message });
    }
}

const motorDelete = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Motor.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ msg: 'Motor no encontrado' });
        }

        return res.status(200).json({ msg: 'Motor eliminado exitosamente' });

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