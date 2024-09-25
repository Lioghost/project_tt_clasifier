import Marca from "./Marca.js";
import Automovil from "./Automovil.js";
import Motor from "./Motor.js";

Automovil.belongsTo(Marca, {foreignKey: 'marcaId'});

export {
    Automovil,
    Marca,
    Motor
}