import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Motor = db.define('motores', {
    id_motor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero_litros: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tipo_arbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_valvulas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    posicion_pistones: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero_pistones: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    info_adicional: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    range_year_i: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
    range_year_f: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
            isNumeric: true
        }
    },
});


//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default Motor