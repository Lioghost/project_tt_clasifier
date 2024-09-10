import { DataTypes } from "sequelize";
import db from '../config/db.js'

//Se almacena la referencia, el ID
//Solo se almacena el ID en la BD

const JuntaDesconocida = db.define('juntas_desconocidas', {
    message: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Se genera una relacion de mensaje en el indexModels.js
export default JuntaDesconocida;