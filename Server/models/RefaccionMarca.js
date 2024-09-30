import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const RefaccionMarca = db.define('refaccion_marca', {
    id_refac: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    marca_refac: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url_marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    junta_id: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default RefaccionMarca