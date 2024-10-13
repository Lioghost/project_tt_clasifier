import { DataTypes } from "sequelize";
import db from '../config/db.js'
import { RefaccionMarca } from './indexModels.js'

//Se almacena la referencia, el ID
//Solo se almacena el ID en la BD

const Junta = db.define('juntas', {
    id_junta: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    id_image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeDestroy: async (junta) => {
            const refaccionMarca = await RefaccionMarca.count({ where: { junta_id: junta.id_junta } })
            if (refaccionMarca > 0)
                throw new Error('No se puede eliminar la junta porque tiene refacciones asociadas')
        }
    }
});

//Se genera una relacion de mensaje en el indexModels.js
export default Junta;