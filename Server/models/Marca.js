import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Marca = db.define('marca', {
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


//Un hook se ejecuta en un determinado momento, por ejemplo en el momento en que se crea un registro, antes de eliminarlo, en el momento que se actualiza

export default Marca