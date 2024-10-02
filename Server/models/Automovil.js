import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Automovil = db.define('automoviles', {
    id_auto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    submarca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    litros: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
});


//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default Automovil