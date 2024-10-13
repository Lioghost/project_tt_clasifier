import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import {Automovil} from './indexModels.js'

const Marca = db.define('marca', {
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeDestroy: async (marca) => {
            const autosAsociados = await Automovil.count({ where: { marca_id: marca.id } })
            if (autosAsociados > 0) {
                throw new Error('No se puede eliminar la marca porque tiene autos asociados')
            }
        }
    }
});


//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default Marca