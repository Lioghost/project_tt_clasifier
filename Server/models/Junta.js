import { DataTypes } from "sequelize";
import db from '../config/db.js'

//Se almacena la referencia, el ID
//Solo se almacena el ID en la BD

const Junta = db.define('juntas', {
    id_junta: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    id_image: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Se genera una relacion de mensaje en el indexModels.js
export default JuntaDesconocida;