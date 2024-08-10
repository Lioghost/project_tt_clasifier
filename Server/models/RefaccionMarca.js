import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const RefaccionMarca = db.define('refaccion_marca', {
    id_refac_marca: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url_marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_valvulas: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});


//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default RefaccionMarca