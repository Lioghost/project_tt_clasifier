import Marca from "./Marca.js";
import Automovil from "./Automovil.js";
import Motor from "./Motor.js";
import RefaccionMarca from "./RefaccionMarca.js";
import { DataTypes } from "sequelize";
import Junta from "./Junta.js";

Automovil.belongsTo(Marca, {foreignKey: 'marca_id'});

Motor.belongsToMany(Automovil, {through: 'AutomovilMotor', foreignKey: 'motor_id'});

Automovil.belongsToMany(Motor, {through: 'AutomovilMotor', foreignKey: 'auto_id'});

Junta.hasMany(RefaccionMarca, {
    foreignKey: {
        name: 'junta_id',
        type: DataTypes.STRING
    }});

RefaccionMarca.belongsTo(Junta, {
    foreignKey: {
        name: 'junta_id',
        type: DataTypes.STRING
    }});

export {
    Automovil,
    Marca,
    Motor,
    RefaccionMarca,
    Junta
}