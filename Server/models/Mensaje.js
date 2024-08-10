import { DataTypes } from "sequelize";
import db from '../config/db.js'

//Se almacena la referencia, el ID
//Solo se almacena el ID en la BD

const Mensaje = db.define('mensajes', {
    mensaje: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
});

//Se genera una relacion de mensaje en el indexModels.js

export default Mensaje;