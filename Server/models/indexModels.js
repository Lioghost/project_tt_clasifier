import Marca from "./Marca.js";
import Automovil from "./Automovil.js";
import Motor from "./Motor.js";
import { DataTypes } from "sequelize";

Automovil.belongsTo(Marca, {
    foreignKey: {
        name: 'marca_id',
        type: DataTypes.INTEGER
    }});

export {
    Automovil,
    Marca,
    Motor
}